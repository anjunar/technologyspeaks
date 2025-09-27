package com.anjunar.scala.schema.model.validators

import com.anjunar.scala.mapper.annotations.{IgnoreFilter, PropertyDescriptor}

import scala.annotation.meta.field

@IgnoreFilter
case class PatternValidator(@(PropertyDescriptor @field)(title = "Regex") regex: String) extends Validator
