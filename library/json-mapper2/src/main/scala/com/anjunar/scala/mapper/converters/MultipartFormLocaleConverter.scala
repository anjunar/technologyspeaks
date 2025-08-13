package com.anjunar.scala.mapper.converters

import com.anjunar.scala.mapper.MultipartFormContext
import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}

import java.util.Locale

class MultipartFormLocaleConverter extends MultipartFormAbstractConverter(TypeResolver.resolve(classOf[Locale])) {

  override def toJava(values: List[String], aType: ResolvedClass, context: MultipartFormContext): Any = Locale.forLanguageTag(values.head)
}
