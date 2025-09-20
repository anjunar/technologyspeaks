package com.anjunar.vertx.engine

import com.anjunar.scala.introspector.DescriptionIntrospector
import com.anjunar.scala.schema.builder.{EntitySchemaBuilder, PropertyBuilder, SchemaBuilder}
import com.anjunar.scala.schema.model.Link as aLink
import com.anjunar.scala.universe.TypeResolver
import org.hibernate.reactive.stage.Stage

import java.util
import java.util.concurrent.{CompletableFuture, CompletionStage}
import scala.collection.mutable
import scala.jdk.CollectionConverters.*

abstract class EntitySchemaDef[E](val entityName: Class[E]) {

  val props = mutable.ListBuffer[PropDef[E, ?]]()

  val beanModel = DescriptionIntrospector.createWithType(entityName)

  def column[T](name: String, views: Set[String] = Set("full")): PropDef[E, T] = {
    val p = PropDef[E, T](name, views = views, entity = beanModel)
    props += p
    p
  }

  def dynamicMap(name: String, attributeRule: AttributeVisibilityRule): PropDef[E, Map[String, Any]] = {
    val p = PropDef[E, Map[String, Any]](name, entity = beanModel)
    props += p
    p
  }

  def build(entity: E,
            entityClass : Class[E],
            ctx: RequestContext,
            sessionFactory: Stage.SessionFactory,
            view: String = "full"): CompletionStage[SchemaBuilder] = {

    val builder = new SchemaBuilder()
    
    val model = DescriptionIntrospector.createWithType(entityClass)

    val futures = mutable.ArrayBuffer[CompletionStage[Void]]()

    if (entity != null) {
      builder
        .forInstance(entity, entity.getClass.asInstanceOf[Class[E]], (builder: EntitySchemaBuilder[E]) => {

          val visibilityFutures = props.map(p => p.name -> p.visibility.isVisible(entity, p.name, ctx, sessionFactory).toCompletableFuture).toMap
          val writeableFutures = props.map(p => p.name -> {
            p.visibility.isWriteable(entity, p.name, ctx, sessionFactory)
              .thenApply(isWriteable => {
                val descriptorProperty = model.findProperty(p.name)
                descriptorProperty.propertyType.raw match {
                  case clazz : Class[?] if classOf[util.Collection[?]].isAssignableFrom(clazz) => isWriteable
                  case clazz : Class[?] if classOf[util.Map[?,?]].isAssignableFrom(clazz) => isWriteable
                  case _ => descriptorProperty.isWriteable && isWriteable
                }
              })
              .toCompletableFuture
          }).toMap

          CompletableFuture.allOf((visibilityFutures.values ++ writeableFutures.values).toSeq *)
            .thenAccept(_ => {
              props
                .filter(p => visibilityFutures(p.name).join())
                .filter(p => p.views.contains(view))
                .foreach { property =>
                  builder.property(property.name, propertyBuilder => {
                    val instanceHandlerOpt = property.instanceHandler
                    val typeHandlerOpt = property.typeHandler
                    if (instanceHandlerOpt.isDefined && typeHandlerOpt.isDefined) {
                      val instanceHandler = instanceHandlerOpt.get.asInstanceOf[(Any, RequestContext, Stage.SessionFactory) => Seq[CompletionStage[SchemaBuilder]]]
                      val typeHandler = typeHandlerOpt.get
                      val model = DescriptionIntrospector.createWithType(entity.getClass)
                      val entityProperty = model.findProperty(property.name)
                      val value = entityProperty.get(entity.asInstanceOf[AnyRef])

                      value match {
                        case collection: util.Collection[?] =>
                          val instanceSchemaFutures = instanceHandler(value, ctx, sessionFactory)
                          val typeSchema = typeHandler(ctx)
                          CompletableFuture.allOf(instanceSchemaFutures.map(_.toCompletableFuture) *)
                            .thenAccept(_ => {
                              collection.forEach { instance =>
                                propertyBuilder
                                  .forInstance(
                                    instance,
                                    instance.getClass.asInstanceOf[Class[Any]],
                                    (childBuilder: EntitySchemaBuilder[Any]) => {
                                      instanceSchemaFutures.foreach { sf =>
                                        sf.thenAccept(schema => {
                                          val mappingOpt = schema.instanceMapping.get(instance)
                                          if (mappingOpt.isDefined) {
                                            childBuilder.mapping.addAll(mappingOpt.get.mapping.asInstanceOf[mutable.Map[String, PropertyBuilder[Any]]])
                                          }
                                        })
                                      }
                                    }
                                  )
                                  .forType(instance.getClass.asInstanceOf[Class[Any]], (childBuilder: EntitySchemaBuilder[Any]) => {
                                    childBuilder.mapping.addAll(typeSchema.typeMapping(instance.getClass).mapping.asInstanceOf[mutable.Map[String, PropertyBuilder[Any]]])
                                  })
                              }

                            })

                        case _ =>
                          val schemaFutures = instanceHandler(value, ctx, sessionFactory)
                          val f = CompletableFuture.allOf(schemaFutures.map(_.toCompletableFuture) *)
                            .thenAccept(_ => {
                              schemaFutures.foreach { sf =>
                                sf.thenAccept(schema => {
                                  propertyBuilder.schemaBuilder = schema
                                })
                              }
                            })
                          futures += f.thenApply(_ => null)
                      }
                    }

                    propertyBuilder.withWriteable(writeableFutures(property.name).join())
                    propertyBuilder.withLinks(linkContext => {
                      property.links.foreach(link => linkContext.addLink(link.rel, aLink(link.href(entity), link.method, link.rel, link.title)))
                    })
                    propertyBuilder
                  })
                }
            })
        })
    }

    builder.forType(entityClass, (builder: EntitySchemaBuilder[Any]) => {
      props
        .filter(property => property.views.contains(view))
        .foreach(property => {
          builder.property(property.name, propertyBuilder => {
            val descriptorProperty = model.findProperty(property.name)
            descriptorProperty.propertyType.raw match {
              case clazz: Class[?] if classOf[util.Collection[?]].isAssignableFrom(clazz) => propertyBuilder.withWriteable(true)
              case clazz: Class[?] if classOf[util.Map[?, ?]].isAssignableFrom(clazz) => propertyBuilder.withWriteable(true)
              case _ => propertyBuilder.withWriteable(descriptorProperty.isWriteable)
            }

            if (property.typeHandler.isDefined) {
              val typeHandler = property.typeHandler.get
              val schema = typeHandler(ctx)
              propertyBuilder.schemaBuilder = schema
            }
            propertyBuilder.withLinks(linkContext => {
              property.links.foreach(link => linkContext.addLink(link.rel, aLink(link.href(null.asInstanceOf[E]), link.method, link.rel, link.title)))
            })
            propertyBuilder
          })
        })
    })


    CompletableFuture.allOf(futures.map(_.toCompletableFuture).toSeq *).thenApply(_ => builder)
  }

  def buildType(entityType: Class[E], ctx: RequestContext, view: String = "full"): SchemaBuilder = {
    val builder = new SchemaBuilder()
    val model = DescriptionIntrospector.createWithType(entityType)

    builder
      .forType(entityType, (builder: EntitySchemaBuilder[E]) => {
        props
          .filter(property => property.views.contains(view))
          .foreach(property => {
            builder.property(property.name, propertyBuilder => {
              val descriptorProperty = model.findProperty(property.name)
              descriptorProperty.propertyType.raw match {
                case clazz: Class[?] if classOf[util.Collection[?]].isAssignableFrom(clazz) => propertyBuilder.withWriteable(true)
                case clazz: Class[?] if classOf[util.Map[?, ?]].isAssignableFrom(clazz) => propertyBuilder.withWriteable(true)
                case _ => propertyBuilder.withWriteable(descriptorProperty.isWriteable)
              }

              if (property.typeHandler.isDefined) {
                val typeHandler = property.typeHandler.get
                val schema = typeHandler(ctx)
                propertyBuilder.schemaBuilder = schema
              }
              propertyBuilder.withLinks(linkContext => {
                property.links.foreach(link => linkContext.addLink(link.rel, aLink(link.href(null.asInstanceOf[E]), link.method, link.rel, link.title)))
              })
              propertyBuilder
            })
          })
      })
  }

}

object EntitySchemaDef {

  def apply[E](clazz: Class[E], rule: VisibilityRule[E] = DefaultRule[E](), view: String = "full"): EntitySchemaDef[E] = {
    val schemaDef = new EntitySchemaDef[E](clazz) {}

    val model = DescriptionIntrospector.createWithType(clazz)

    model.properties.foreach(property => {

      property.propertyType.raw match {
        case clazz: Class[?] if classOf[util.Collection[?]].isAssignableFrom(clazz) =>
          val collectionType = property
            .propertyType
            .typeArguments(0)
            .raw
            .asInstanceOf[Class[Any]]

          TypeResolver.companionInstance(collectionType) match {
            case typeSchema: SchemaProvider[Any] =>
              schemaDef.column(property.name, views = Set(view))
                .visibleWhen(rule)
                .forType(ctx => typeSchema.schema.buildType(collectionType, ctx, view))
                .forInstance((list: util.Collection[?], ctx, session) => {
                  list.asScala.map(item => typeSchema.schema.build(item, collectionType, ctx, session, view)).toSeq
                })
            case null =>
              schemaDef.column(property.name, views = Set(view))
                .visibleWhen(rule)
          }

        case _ =>
          val propertyType = property.propertyType
            .raw
            .asInstanceOf[Class[Any]]

          TypeResolver.companionInstance(propertyType) match {
            case typeSchema: SchemaProvider[Any] =>
              schemaDef.column(property.name, views = Set(view))
                .visibleWhen(rule)
                .forType(ctx => typeSchema.schema.buildType(propertyType, ctx, view))
                .forInstance((list: Any, ctx, session) => {
                  Seq(typeSchema.schema.build(list, propertyType, ctx, session, view))
                })
            case null =>
              schemaDef.column(property.name, views = Set(view))
                .visibleWhen(rule)
          }
      }
    })

    schemaDef
  }

}
