package com.anjunar.scala.schema.engine

import com.anjunar.scala.introspector.DescriptionIntrospector
import com.anjunar.scala.schema.builder.{EntitySchemaBuilder, SchemaBuilder}
import com.anjunar.scala.schema.engine.SchemaView.Full
import com.anjunar.scala.schema.model

import java.util

import scala.collection.mutable

abstract class EntitySchemaDef[E](val entityName: String) {
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

    builder
      .forInstance(entity, entity.getClass.asInstanceOf[Class[E]], (builder: EntitySchemaBuilder[E]) => {
        props
          .filter(property => property.views.contains(view) && property.visibility.isVisible(entity, property.name, ctx))
          .foreach(property => {
            builder.property(property.name, propertyBuilder => {
              if (property.typeHandler.isDefined) {
                val typeHandler = property.typeHandler.get.asInstanceOf[(AnyRef, RequestContext) => SchemaBuilder]
                val model = DescriptionIntrospector.createWithType(entity.getClass)
                val entityProperty = model.findProperty(property.name)
                val value = entityProperty.get(entity.asInstanceOf[AnyRef])
                value match {
                  case collection : util.Collection[?] => collection.forEach(item => {
                    val schemaBuilder = typeHandler(item, ctx)
                    propertyBuilder.schemaBuilder = schemaBuilder
                  })
                  case element : AnyRef =>
                    val schemaBuilder = typeHandler(element, ctx)
                    propertyBuilder.schemaBuilder = schemaBuilder
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
      .forType(entity.getClass, (builder: EntitySchemaBuilder[E]) => {
        props
          .filter(property => property.views.contains(view))
          .foreach(property => {
            builder.property(property.name, propertyBuilder => {
              if (property.typeHandler.isDefined) {
                val typeHandler = property.typeHandler.get.asInstanceOf[(AnyRef, RequestContext) => SchemaBuilder]
                val model = DescriptionIntrospector.createWithType(entity.getClass)
                val entityProperty = model.findProperty(property.name)
                val value = entityProperty.get(entity.asInstanceOf[AnyRef])
                value match {
                  case collection : util.Collection[?] => collection.forEach(item => {
                    val schemaBuilder = typeHandler(item, ctx)
                    propertyBuilder.schemaBuilder = schemaBuilder
                  })
                  case element : AnyRef =>
                    val schemaBuilder = typeHandler(element, ctx)
                    propertyBuilder.schemaBuilder = schemaBuilder
                }
              }
              propertyBuilder.withLinks(linkContext => {
                property.links.foreach(link => linkContext.addLink(link.rel, model.Link(link.href(entity), link.method, link.rel, link.title)))
              })
              propertyBuilder
            })
          })
      })
  }
}
