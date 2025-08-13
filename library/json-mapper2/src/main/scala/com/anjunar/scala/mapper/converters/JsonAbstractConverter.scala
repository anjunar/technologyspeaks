package com.anjunar.scala.mapper.converters

import com.anjunar.scala.mapper.{JsonContext, UploadedFile}
import com.anjunar.scala.mapper.intermediate.model.{JsonNode, JsonObject}
import com.anjunar.scala.universe.ResolvedClass

abstract class JsonAbstractConverter(val aClass : ResolvedClass) {
  
  def toJson(instance: Any, aType: ResolvedClass, context: JsonContext): JsonNode
  
  def toJava(jsonNode: JsonNode, aType: ResolvedClass, context: JsonContext): Any
  
}
