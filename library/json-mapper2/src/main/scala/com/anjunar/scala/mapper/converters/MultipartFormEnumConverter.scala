package com.anjunar.scala.mapper.converters

import com.anjunar.scala.mapper.MultipartFormContext
import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}
import com.fasterxml.jackson.annotation.JsonCreator

import java.util.Objects

class MultipartFormEnumConverter extends MultipartFormAbstractConverter(TypeResolver.resolve(classOf[Enum[?]])) {

  override def toJava(values: List[String], aType: ResolvedClass, context: MultipartFormContext): Any = {
    val resolvedMethod = aType
      .methods
      .find(member => Objects.nonNull(member.findDeclaredAnnotation(classOf[JsonCreator])))

    if (resolvedMethod.isDefined) {
      resolvedMethod.get.invoke(null, values.head)
    } else {
      val enumClass = aType.raw
      val enumConstants = enumClass.getEnumConstants.asInstanceOf[Array[Enum[?]]]
      enumConstants.find((anEnum: Enum[?]) => anEnum.name() == values.head).get
    }
  }
}
