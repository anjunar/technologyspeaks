package com.anjunar.scala.mapper.converters

import com.anjunar.scala.mapper.MultipartFormContext
import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}

class MultipartFormBooleanConverter extends MultipartFormAbstractConverter(TypeResolver.resolve(classOf[Boolean])) {

  override def toJava(values: List[String], aType: ResolvedClass, context: MultipartFormContext): Any = {
    java.lang.Boolean.valueOf(values.head)
  }
  
}
