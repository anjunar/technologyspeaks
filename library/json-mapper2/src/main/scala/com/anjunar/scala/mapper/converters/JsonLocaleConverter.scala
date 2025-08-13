package com.anjunar.scala.mapper.converters

import com.anjunar.scala.mapper.JsonContext
import com.anjunar.scala.mapper.intermediate.model.{JsonNode, JsonString}
import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}

import java.util.Locale

class JsonLocaleConverter extends JsonAbstractConverter(TypeResolver.resolve(classOf[Locale])) {

  override def toJson(instance: Any, aType: ResolvedClass, context: JsonContext): JsonNode = JsonString(instance.asInstanceOf[Locale].toLanguageTag)

  override def toJava(jsonNode: JsonNode, aType: ResolvedClass, context: JsonContext): Any = Locale.forLanguageTag(jsonNode.value.asInstanceOf[String])
}
