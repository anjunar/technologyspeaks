package com.anjunar.scala.schema.model

import com.anjunar.scala.mapper.annotations.{PropertyDescriptor, IgnoreFilter}

import java.util
import scala.beans.BeanProperty
import scala.compiletime.uninitialized

@IgnoreFilter
class ObjectDescriptor extends NodeDescriptor {

  @PropertyDescriptor(title = "Properties")
  val properties : util.Map[String, NodeDescriptor] = new util.LinkedHashMap[String, NodeDescriptor]()

  @PropertyDescriptor(title = "One of")
  val oneOf : util.List[ObjectDescriptor] = new util.ArrayList[ObjectDescriptor]()
  
}