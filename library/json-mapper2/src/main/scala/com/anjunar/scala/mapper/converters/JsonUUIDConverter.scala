package com.anjunar.scala.mapper.converters

import com.anjunar.scala.mapper.JsonContext
import com.anjunar.scala.mapper.intermediate.model.{JsonNode, JsonString}
import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}

import java.util.UUID

class JsonUUIDConverter extends JsonAbstractConverter(TypeResolver.resolve(classOf[UUID])) {

  override def toJson(instance: Any, aType: ResolvedClass, context: JsonContext): JsonNode = instance match
    case uuid : UUID => JsonString(uuid.toString)

  override def toJava(jsonNode: JsonNode, aType: ResolvedClass, context: JsonContext): Any = {
    UUID.fromString(jsonNode.value.asInstanceOf[String])
  }
  
}
