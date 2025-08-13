package com.anjunar.scala.mapper.converters

import com.anjunar.scala.mapper.MultipartFormContext
import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}

import java.time.Duration
import java.time.temporal.TemporalAmount

class MultipartFormTemporalAmountConverter extends MultipartFormAbstractConverter(TypeResolver.resolve(classOf[TemporalAmount])) {

  override def toJava(values: List[String], aType: ResolvedClass, context: MultipartFormContext): Any = {
    Duration.parse(values.head)
  }
  
}
