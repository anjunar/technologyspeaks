package com.anjunar.scala.mapper.converters

import com.anjunar.scala.mapper.MultipartFormContext
import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}

import java.time.temporal.Temporal

class MultipartFormTemporalConverter extends MultipartFormAbstractConverter(TypeResolver.resolve(classOf[Temporal])) {

  override def toJava(values: List[String], aType: ResolvedClass, context: MultipartFormContext): Any = {
    val method = aType.findDeclaredMethod("parse", classOf[CharSequence])
    method.invoke(null, values.head)
  }
  
}
