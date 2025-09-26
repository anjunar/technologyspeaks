package com.anjunar.scala.schema.builder

import com.anjunar.scala.schema.model.Link
import com.anjunar.scala.universe.ResolvedClass

import scala.collection.mutable

case class ClassSchema(clazz : ResolvedClass) {
  
  val properties : mutable.Map[String, ClassProperty] = new mutable.LinkedHashMap[String, ClassProperty]()

  val links : mutable.Buffer[Link] = mutable.ArrayBuffer()
  
}
