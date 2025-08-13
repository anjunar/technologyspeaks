package com.anjunar.scala.schema.builder

import com.anjunar.scala.mapper.annotations.JsonSchema

import java.lang.reflect.Type

trait EntityJSONSchema[A] {
  
  def build(instance: A, aType: Type): SchemaBuilder
  
}
