package com.anjunar.jaxrs.types

import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import java.util
import java.util.List
import scala.annotation.meta.field
import scala.beans.BeanProperty


class Table[E](@BeanProperty
               @(PropertyDescriptor @field)(title = "Rows", widget = "table")
               var rows: util.List[E],
                            @(PropertyDescriptor @field)(title = "Size")
               var size: Long) {

  def this() = {
    this(null, 0L)
  }

}
