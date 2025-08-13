package com.anjunar.scala.mapper.converters

import com.anjunar.scala.mapper.JsonContext
import com.anjunar.scala.mapper.intermediate.model.{JsonNode, JsonString}
import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}

import java.time.Duration
import java.time.temporal.TemporalAmount

class JsonTemporalAmountConverter extends JsonAbstractConverter(TypeResolver.resolve(classOf[TemporalAmount])) {

  override def toJson(instance: Any, aType: ResolvedClass, context: JsonContext): JsonNode = instance match
    case temporal : TemporalAmount => JsonString(temporal.toString)

  override def toJava(jsonNode: JsonNode, aType: ResolvedClass, context: JsonContext): Any = {
    Duration.parse(jsonNode.value.toString)
  }
}
