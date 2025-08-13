package com.anjunar.scala.schema.model.validators

import com.anjunar.scala.mapper.annotations.{PropertyDescriptor, IgnoreFilter}

import scala.beans.BeanProperty

@IgnoreFilter
case class SizeValidator(@PropertyDescriptor(title = "Minimum") min : Int,
                         @PropertyDescriptor(title = "Maximum") max : Int) extends Validator 
