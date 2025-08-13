package com.anjunar.technologyspeaks.security

import com.anjunar.scala.mapper.annotations.PropertyDescriptor

import scala.compiletime.uninitialized

class Confirmation {

  @PropertyDescriptor(title = "Code")
  var code: String = uninitialized

  override def toString = s"Confirmation($code)"
}
