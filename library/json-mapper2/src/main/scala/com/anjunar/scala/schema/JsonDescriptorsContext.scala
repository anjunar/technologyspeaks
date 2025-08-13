package com.anjunar.scala.schema

import com.anjunar.scala.schema.model.{NodeDescriptor, ObjectDescriptor}

import scala.compiletime.uninitialized

class JsonDescriptorsContext(val parent : JsonDescriptorsContext) {

  var descriptor : NodeDescriptor = uninitialized

  def findClass(value : Class[?]) : ObjectDescriptor = descriptor match {
    case descriptor : ObjectDescriptor if descriptor.`type` == value.getSimpleName => descriptor
    case _ => if parent == null then null else parent.findClass(value)
  }
}
