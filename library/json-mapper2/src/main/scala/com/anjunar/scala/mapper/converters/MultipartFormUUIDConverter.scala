package com.anjunar.scala.mapper.converters

import com.anjunar.scala.mapper.MultipartFormContext
import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}

import java.util.UUID

class MultipartFormUUIDConverter extends MultipartFormAbstractConverter(TypeResolver.resolve(classOf[UUID])) {

  override def toJava(values: List[String], aType: ResolvedClass, context: MultipartFormContext): Any = {
    UUID.fromString(values.head)
  }
  
}
