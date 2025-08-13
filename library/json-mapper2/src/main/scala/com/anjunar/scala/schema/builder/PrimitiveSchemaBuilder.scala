package com.anjunar.scala.schema.builder

import scala.compiletime.uninitialized

class PrimitiveSchemaBuilder[D](aClass : Class[D], table : Boolean, parent : SchemaBuilder) {

  var alias : String = uninitialized
  
  var title : String = uninitialized

  var description : String = uninitialized

  var widget : String = uninitialized

  var id : Boolean = uninitialized

  var naming : Boolean = uninitialized

  var hidden: Boolean = uninitialized

  var step: String = uninitialized

  def withAlias(value: String): PrimitiveSchemaBuilder[D] = {
    alias = value
    this
  }

  def withTitle(value: String): PrimitiveSchemaBuilder[D] = {
    title = value
    this
  }

  def withDescription(value: String): PrimitiveSchemaBuilder[D] = {
    description = value
    this
  }

  def withWidget(value: String): PrimitiveSchemaBuilder[D] = {
    widget = value
    this
  }

  def withId(value: Boolean): PrimitiveSchemaBuilder[D] = {
    id = value
    this
  }

  def withNaming(value: Boolean): PrimitiveSchemaBuilder[D] = {
    naming = value
    this
  }

  def withHidden(value: Boolean): PrimitiveSchemaBuilder[D] = {
    hidden = value
    this
  }

  def withStep(value: String): PrimitiveSchemaBuilder[D] = {
    step = value
    this
  }

}
