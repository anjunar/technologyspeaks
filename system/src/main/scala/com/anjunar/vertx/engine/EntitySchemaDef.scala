package com.anjunar.vertx.engine

import com.anjunar.scala.introspector.DescriptionIntrospector
import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.scala.mapper.helper.Futures
import com.anjunar.scala.schema.builder.{ClassProperty, ClassSchema, Schemas}
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
            entityClass: Class[E],
            ctx: RequestContext,
            session: Stage.Session,
            view: String = "full"): CompletionStage[Schemas] = {

    val model = DescriptionIntrospector.createWithType(entityClass)

    val futures = props.filter(prop => prop.views.contains(view)).map { prop =>
      () =>
        prop.visibility.isVisible(entity, prop.name, ctx, session)
          .thenCompose { visibility =>
            prop.visibility.isWriteable(entity, prop.name, ctx, session)
              .thenCompose { writeableProperty =>
                val descriptorProperty = model.findProperty(prop.name)
                val entityType = descriptorProperty.propertyType.raw.asInstanceOf[Class[E]]
                val annotation = descriptorProperty.findAnnotation(classOf[PropertyDescriptor])

                val writeable = descriptorProperty.propertyType.raw match {
                  case clazz: Class[?] if classOf[util.Collection[?]].isAssignableFrom(clazz) => writeableProperty
                  case clazz: Class[?] if classOf[util.Map[?, ?]].isAssignableFrom(clazz) => writeableProperty
                  case _ => descriptorProperty.isWriteable && writeableProperty
                }

                val typedLinks = prop.staticLinks.map(link => link())

                val typedSchemas = if (prop.typeHandler.isDefined) {
                  val typeHandler = prop.typeHandler.get
                  typeHandler(ctx)
                } else {
                  null
                }

                if (prop.instanceHandler.isDefined) {
                  val instanceHandler = prop.instanceHandler.get
                  val typedInstanceHandler = instanceHandler.asInstanceOf[(Any, RequestContext, Stage.Session) => Seq[CompletionStage[Schemas]]]
                  val value = descriptorProperty.get(entity.asInstanceOf[AnyRef])

                  if (value == null) {
                    CompletableFuture.completedFuture(ClassProperty(descriptorProperty, writeable, visibility, typedSchemas, typedLinks, annotation))
                  } else {
                    val instanceFutures = typedInstanceHandler(value, ctx, session).toList

                    Futures.combineAll(instanceFutures).thenCompose { instances =>
                      Futures.combineAllSerial(prop.dynamicLinks.map(link => () => link(entity, ctx, session)).toList)
                        .thenApply { links =>
                          val aggregated = instances.foldLeft(Schemas()) { (acc, nextSchema) =>
                            acc.instances.addAll(nextSchema.instances)
                            acc.types.addAll(nextSchema.types)
                            acc
                          }

                          aggregated.types.addAll(typedSchemas.types)

                          ClassProperty(descriptorProperty, writeable, visibility, aggregated, links ++ typedLinks, annotation)
                        }
                    }
                  }

                } else {
                  Futures.combineAll(prop.dynamicLinks.map(link => link(entity, ctx, session)).toList)
                    .thenApply { links =>
                      ClassProperty(descriptorProperty, writeable, visibility, typedSchemas, links ++ typedLinks, annotation)
                    }
                }
              }
          }
    }

    Futures.combineAllSerial(futures.toList).thenApply { (props: Seq[ClassProperty]) =>
      val typedSchema = buildType(entityClass, ctx, view)
      val classSchema = ClassSchema(model.underlying)
      val schemas = Schemas()
      classSchema.properties.addAll(props.map(prop => prop.property.name -> prop))
      schemas.instances += entity -> classSchema
      schemas.types.addAll(typedSchema.types)
      schemas
    }
  }

  def buildType(entityType: Class[E], ctx: RequestContext, view: String = "full"): Schemas = {
    val model = DescriptionIntrospector.createWithType(entityType)

    val properties = props
      .map(property => {
        val descriptorProperty = model.findProperty(property.name)
        val annotation = descriptorProperty.findAnnotation(classOf[PropertyDescriptor])

        val writeable = descriptorProperty.propertyType.raw match {
          case clazz: Class[?] if classOf[util.Collection[?]].isAssignableFrom(clazz) => true
          case clazz: Class[?] if classOf[util.Map[?, ?]].isAssignableFrom(clazz) => true
          case _ => descriptorProperty.isWriteable
        }

        val schemas = if (property.typeHandler.isDefined) {
          val typeHandler = property.typeHandler.get
          typeHandler(ctx)
        } else {
          null
        }

        val links = property.staticLinks.map(link => link())

        ClassProperty(descriptorProperty, writeable, property.views.contains(view), schemas, links, annotation)
      })

    val classSchema = ClassSchema(model.underlying)
    val schemas = Schemas()
    classSchema.properties.addAll(properties.map(prop => prop.property.name -> prop))
    schemas.types += model.underlying.raw -> classSchema
    schemas
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
