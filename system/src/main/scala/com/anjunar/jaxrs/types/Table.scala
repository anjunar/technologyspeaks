package com.anjunar.jaxrs.types

import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.scala.universe.TypeResolver
import com.anjunar.vertx.engine.{DynamicSchemaProvider, EntitySchemaDef, SchemaProvider, SchemaView}
import io.netty.util.concurrent.CompleteFuture
import org.hibernate.reactive.stage.Stage

import java.util
import java.util.List
import java.util.concurrent.CompletableFuture
import scala.annotation.meta.field
import scala.jdk.CollectionConverters.*

class Table[E](@(PropertyDescriptor @field)(title = "Rows", widget = "table") val rows: util.List[E],
               @(PropertyDescriptor @field)(title = "Size") val size: Long)

object Table extends DynamicSchemaProvider {
  def schema[E](clazz: Class[E], view: String) = new EntitySchemaDef[Table[E]](classOf[Table[E]]) {
    val rows = column[util.List[E]]("rows", views = Set(view))
      .forType(ctx => {
        val schemaDef = TypeResolver.companionInstance(clazz).asInstanceOf[SchemaProvider[E]]
        schemaDef.schema.buildType(clazz, ctx, view)
      })
      .forInstance((list, ctx, factory) => {
        val schemaDef = TypeResolver.companionInstance(clazz).asInstanceOf[SchemaProvider[E]]
        list.asScala.map(elem => schemaDef.schema.build(elem, ctx, factory, view)).toSeq
      })
    val size = column[Long]("size", views = Set(view))
  }
}
