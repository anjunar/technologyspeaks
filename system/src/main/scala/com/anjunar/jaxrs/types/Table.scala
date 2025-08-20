package com.anjunar.jaxrs.types

import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.scala.universe.TypeResolver
import com.anjunar.vertx.engine.{DynamicSchemaProvider, EntitySchemaDef, SchemaProvider, SchemaView}

import java.util
import java.util.List
import scala.annotation.meta.field
import scala.jdk.CollectionConverters.*

class Table[E](@(PropertyDescriptor @field)(title = "Rows", widget = "table") val rows: util.List[E],
               @(PropertyDescriptor @field)(title = "Size") val size: Long)

object Table extends DynamicSchemaProvider {
  def schema[E](clazz: Class[E], view: SchemaView) = new EntitySchemaDef[Table[E]]("Table") {
    val rows = column[util.List[E]]("rows")
      .forType(ctx => {
        val schemaDef = TypeResolver.companionInstance(clazz).asInstanceOf[SchemaProvider[E]]
        schemaDef.schema.buildType(clazz, ctx, view)
      })
      .forInstance((list, ctx) => {
        val schemaDef = TypeResolver.companionInstance(clazz).asInstanceOf[SchemaProvider[E]]
        list.asScala.map(elem => schemaDef.schema.build(elem, ctx, view)).toSeq
      })
    val size = column[Long]("size")
  }
}
