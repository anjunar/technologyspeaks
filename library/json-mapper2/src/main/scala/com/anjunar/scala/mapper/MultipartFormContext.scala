package com.anjunar.scala.mapper

import com.anjunar.scala.mapper.loader.{JsonEntityLoader, FormEntityLoader}
import com.anjunar.scala.schema.builder.{PropertyBuilder, SchemaBuilder}
import com.anjunar.scala.schema.model.Link
import jakarta.validation.{ConstraintViolation, Validator}

import java.util
import scala.collection.mutable
import scala.compiletime.uninitialized

case class MultipartFormContext(parent : Context,
                       name : String,
                       noValidation : Boolean,
                       validator : Validator,
                       registry: MultipartFormConverterRegistry,
                       schema: SchemaBuilder,
                       links : mutable.Buffer[Link],
                       loader: FormEntityLoader) extends Context {

  var filter : Array[String] = Array()

}

object MultipartFormContext {

  def apply(parent : Context, propertyName: String, noValidation : Boolean, propertySchema : SchemaBuilder, context: MultipartFormContext): MultipartFormContext = {
    val newContext = MultipartFormContext(
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