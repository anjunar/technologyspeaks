package com.anjunar.scala.schema.model.validators

import com.anjunar.scala.mapper.annotations.{IgnoreFilter, PropertyDescriptor}

import scala.annotation.meta.field

@IgnoreFilter
case class SizeValidator(@(PropertyDescriptor @field)(title = "Minimum") min: Int,
                         @(PropertyDescriptor @field)(title = "Maximum") max: Int) extends Validator
