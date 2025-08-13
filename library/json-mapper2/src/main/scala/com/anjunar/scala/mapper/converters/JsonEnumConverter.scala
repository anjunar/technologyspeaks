package com.anjunar.scala.mapper.converters

import com.anjunar.scala.mapper.JsonContext
import com.anjunar.scala.mapper.intermediate.model.{JsonNode, JsonString}
import com.anjunar.scala.universe.members.ResolvedMethod
import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}
import com.fasterxml.jackson.annotation.{JsonCreator, JsonValue}

import java.util
import java.util.{Arrays, Objects}
import scala.language.existentials

class JsonEnumConverter extends JsonAbstractConverter(TypeResolver.resolve(classOf[Enum[?]])) {

  override def toJson(instance: Any, aType: ResolvedClass, context: JsonContext): JsonNode = {
    val resolvedMember = aType
      .methods
      .find((member: ResolvedMethod) => Objects.nonNull(member.findDeclaredAnnotation(classOf[JsonValue])))

    if (resolvedMember.isDefined) {
      JsonString(resolvedMember.get.invoke(instance.asInstanceOf[AnyRef]).asInstanceOf[String])
    } else {
      JsonString(instance.asInstanceOf[Enum[?]].name)
    } 

  }

  override def toJava(jsonNode: JsonNode, aType: ResolvedClass, context: JsonContext): Any = {
    val resolvedMethod = aType
      .methods
      .find(member => Objects.nonNull(member.findDeclaredAnnotation(classOf[JsonCreator])))

    if (resolvedMethod.isDefined) { 
      resolvedMethod.get.invoke(null, jsonNode.value)
    } else {
      val enumClass = aType.raw
      val enumConstants = enumClass.getEnumConstants.asInstanceOf[Array[Enum[?]]]
      enumConstants.find((anEnum : Enum[?]) => anEnum.name() == jsonNode.value).get
    }

  }
}
