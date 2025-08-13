package com.anjunar.scala.mapper

import com.anjunar.scala.mapper.loader.JsonEntityLoader
import com.anjunar.scala.schema.builder.{PropertyBuilder, SchemaBuilder}
import com.anjunar.scala.schema.model.Link
import jakarta.validation.{ConstraintViolation, Validator}

import java.util
import scala.collection.mutable
import scala.compiletime.uninitialized

case class JsonContext(parent : JsonContext,
                       name : String,
                       noValidation : Boolean,
                       validator : Validator,
                       registry: JsonConverterRegistry,
                       schema: SchemaBuilder,
                       links : mutable.Buffer[Link],
                       loader: JsonEntityLoader) extends Context {

  var filter : Array[String] = Array()

}

object JsonContext {

  def apply(parent : JsonContext, propertyName: String, noValidation : Boolean, propertySchema : SchemaBuilder, context: JsonContext): JsonContext = {
    val newContext = JsonContext(
      parent,
      propertyName,
      noValidation,
      context.validator,
      context.registry,
      propertySchema,
      context.links,
      context.loader
    )

    context.children.put(propertyName, newContext)

    newContext
  }

}