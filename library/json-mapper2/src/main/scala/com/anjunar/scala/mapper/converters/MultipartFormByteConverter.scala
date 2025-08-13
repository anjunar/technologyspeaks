package com.anjunar.scala.mapper.converters

import com.anjunar.scala.mapper.MultipartFormContext
import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}

class MultipartFormByteConverter extends MultipartFormAbstractConverter(TypeResolver.resolve(classOf[Array[Byte]])) {

  override def toJava(values: List[String], aType: ResolvedClass, context: MultipartFormContext): Any = values.head.getBytes
  
}
