package com.anjunar.scala.schema.builder2

import com.anjunar.scala.universe.ResolvedClass

import scala.collection.mutable

case class Schemas() {
  
  val instances : mutable.Map[Any, ClassSchema] = new mutable.LinkedHashMap[Any, ClassSchema]()

  val types : mutable.Map[Class[?], ClassSchema] = new mutable.LinkedHashMap[Class[?], ClassSchema]()

}
