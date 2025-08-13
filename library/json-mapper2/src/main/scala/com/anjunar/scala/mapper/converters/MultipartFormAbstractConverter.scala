package com.anjunar.scala.mapper.converters

import com.anjunar.scala.mapper.MultipartFormContext
import com.anjunar.scala.universe.ResolvedClass

abstract class MultipartFormAbstractConverter(val aClass : ResolvedClass) {
  
  def toJava(values : List[String], aType : ResolvedClass, context : MultipartFormContext) : Any

}
