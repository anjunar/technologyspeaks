package com.anjunar.jaxrs.types

import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import scala.beans.BeanProperty
import scala.compiletime.uninitialized

class Sort {

  @PropertyDescriptor(title = "Property", writeable = true)
  var property : String = uninitialized

  @PropertyDescriptor(title = "Value", writeable = true)
  var value : String = uninitialized

}
