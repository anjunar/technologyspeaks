package com.anjunar.scala.mapper.converters

import com.anjunar.scala.mapper.JsonContext
import com.anjunar.scala.mapper.intermediate.model.{JsonNode, JsonString}
import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}

class JsonStringConverter extends JsonAbstractConverter(TypeResolver.resolve(classOf[String])) {

  override def toJson(instance: Any, aType: ResolvedClass, context: JsonContext): JsonNode = JsonString(instance.asInstanceOf[String])

  override def toJava(jsonNode: JsonNode, aType: ResolvedClass, context: JsonContext): Any = jsonNode.value
  
}
