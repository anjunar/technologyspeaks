package com.anjunar.vertx.engine

import com.anjunar.scala.introspector.DescriptionIntrospector
import com.anjunar.scala.schema.builder.{EntitySchemaBuilder, PropertyBuilder, SchemaBuilder}
import SchemaView.Full
import com.anjunar.scala.schema.model
import com.anjunar.scala.universe.TypeResolver

import java.util
import scala.collection.mutable
import scala.jdk.CollectionConverters.*

abstract class EntitySchemaDef[E](val entityName: Class[E]) {
  val props = mutable.ListBuffer[PropDef[E, ?]]()

  def column[T](name: String, views: Set[SchemaView] = Set(SchemaView.Full)): PropDef[E, T] = {
    val p = PropDef[E, T](name, views = views)
    props += p
    p
  }

  def dynamicMap(name: String, attributeRule: AttributeVisibilityRule): PropDef[E, Map[String, Any]] = {
    val p = PropDef[E, Map[String, Any]](name)
    props += p
    p
  }

  def build(entity: E, ctx: RequestContext, view: SchemaView = Full): SchemaBuilder = {
    val builder = new SchemaBuilder()

    if entity == null then return builder

    builder
      .forInstance(entity, entity.getClass.asInstanceOf[Class[E]], (builder: EntitySchemaBuilder[E]) => {
        props
          .filter(property => property.views.contains(view) && property.visibility.isVisible(entity, property.name, ctx))
          .foreach(property => {
            builder.property(property.name, propertyBuilder => {
              if (property.instanceHandler.isDefined) {
                val typeHandler = property.instanceHandler.get.asInstanceOf[(Any, RequestContext) => Seq[SchemaBuilder]]
                val model = DescriptionIntrospector.createWithType(entity.getClass)
                val entityProperty = model.findProperty(property.name)
                val value = entityProperty.get(entity.asInstanceOf[AnyRef])
                value match {
                  case collection: util.Collection[?] =>
                    val schemas = typeHandler(value, ctx)
                    collection.forEach(instance => {
                      propertyBuilder.forInstance(instance, instance.getClass.asInstanceOf[Class[Any]], (builder : EntitySchemaBuilder[Any]) => {
                        builder.mapping.addAll(schemas.find(schema => schema.instanceMapping.contains(instance)).get.findInstanceMapping(instance).asInstanceOf[Map[String, PropertyBuilder[Any]]])
                      })
                    })
                  case _ =>
                    val schemas = typeHandler(value, ctx)
                    val schemaOption = schemas.find(schema => schema.instanceMapping.contains(value))
                    propertyBuilder.schemaBuilder = schemaOption.orNull
                }
              }
              propertyBuilder.withWriteable(property.visibility.isWriteable(entity, property.name, ctx))
              propertyBuilder.withLinks(linkContext => {
                property.links.foreach(link => linkContext.addLink(link.rel, model.Link(link.href(entity), link.method, link.rel, link.title)))
              })
              propertyBuilder
            })
          })
      })
  }

  def buildType(entityType: Class[E], ctx: RequestContext, view: SchemaView = Full): SchemaBuilder = {
    val builder = new SchemaBuilder()

    builder
      .forType(entityType, (builder: EntitySchemaBuilder[E]) => {
        props
          .filter(property => property.views.contains(view))
          .foreach(property => {
            builder.property(property.name, propertyBuilder => {
              if (property.typeHandler.isDefined) {
                val typeHandler = property.typeHandler.get
                val schema = typeHandler(ctx)
                propertyBuilder.schemaBuilder = schema
              }
              propertyBuilder.withLinks(linkContext => {
                property.links.foreach(link => linkContext.addLink(link.rel, model.Link(link.href(null.asInstanceOf[E]), link.method, link.rel, link.title)))
              })
              propertyBuilder
            })
          })
      })
  }

}

object EntitySchemaDef {

  def apply[E](clazz : Class[E]) : EntitySchemaDef[E] = {
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
              schemaDef.column(property.name)
                .forType(ctx => typeSchema.schema.buildType(collectionType, ctx))
                .forInstance((list: util.Collection[?], ctx) => list.asScala.map(item => typeSchema.schema.build(item, ctx)).toSeq)
            case null => throw new IllegalStateException(collectionType.getName + " is not a SchemaProvider")
          }

        case _ =>
          val propertyType = property.propertyType
            .raw
            .asInstanceOf[Class[Any]]

          TypeResolver.companionInstance(propertyType) match {
            case typeSchema: SchemaProvider[Any] =>
              schemaDef.column(property.name)
                .forType(ctx => typeSchema.schema.buildType(propertyType, ctx))
                .forInstance((list: Any, ctx) => Seq(typeSchema.schema.build(list, ctx)))
            case null =>
              schemaDef.column(property.name)
          }
      }      
    })

    schemaDef
  }

}
