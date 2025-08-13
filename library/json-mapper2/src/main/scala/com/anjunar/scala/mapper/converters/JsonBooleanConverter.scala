package com.anjunar.scala.mapper.converters

import com.anjunar.scala.mapper.JsonContext
import com.anjunar.scala.mapper.intermediate.model.{JsonBoolean, JsonNode}
import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}

import java.lang.Boolean

class JsonBooleanConverter extends JsonAbstractConverter(TypeResolver.resolve(classOf[Boolean])) {

  override def toJson(instance: Any, aType: ResolvedClass, context: JsonContext): JsonNode = JsonBoolean(instance.asInstanceOf[Boolean])

  override def toJava(jsonObject: JsonNode, aType: ResolvedClass, context: JsonContext): Any = jsonObject.value
  
}
