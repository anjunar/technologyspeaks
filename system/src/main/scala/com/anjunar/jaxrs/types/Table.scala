package com.anjunar.jaxrs.types

import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.scala.universe.TypeResolver
import com.anjunar.vertx.engine.{EntitySchemaDef, SchemaView}

import java.util
import java.util.List
import scala.annotation.meta.field
import scala.jdk.CollectionConverters.*

class Table[E](@(PropertyDescriptor @field)(title = "Rows", widget = "table") val rows: util.List[E],
               @(PropertyDescriptor @field)(title = "Size") val size: Long)

object Table {
  def schema[E](clazz: Class[E], view: SchemaView) = new EntitySchemaDef[Table[E]]("Table") {
    val rows = column[util.List[E]]("rows")
      .forType(ctx => {
        val resolvedClass = TypeResolver.resolve(clazz)
        val resolvedMethod = resolvedClass.findMethod("schema")
        val schemaDef = resolvedMethod.invoke(null).asInstanceOf[EntitySchemaDef[E]]
        schemaDef.buildType(clazz, ctx, view)
      })
      .forInstance((list, ctx) => {
        val resolvedClass = TypeResolver.resolve(clazz)
        val resolvedMethod = resolvedClass.findMethod("schema")
        val schemaDef = resolvedMethod.invoke(null).asInstanceOf[EntitySchemaDef[E]]
        list.asScala.map(elem => schemaDef.build(elem, ctx, view)).toSeq
      })
    val size = column[Long]("size")
  }
}
