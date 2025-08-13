package com.anjunar.scala.schema.model

import com.anjunar.scala.mapper.annotations.{PropertyDescriptor, IgnoreFilter}

import scala.beans.BeanProperty
import scala.compiletime.uninitialized

@IgnoreFilter
class CollectionDescriptor extends NodeDescriptor {
  
  @PropertyDescriptor(title = "Items")
  var items : NodeDescriptor = uninitialized
  
}
