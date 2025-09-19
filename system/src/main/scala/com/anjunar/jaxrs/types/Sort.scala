package com.anjunar.jaxrs.types

import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import scala.beans.BeanProperty
import scala.compiletime.uninitialized

class Sort {

  @PropertyDescriptor(title = "Property")
  var property : String = uninitialized

  @PropertyDescriptor(title = "Value")
  var value : String = uninitialized

}
