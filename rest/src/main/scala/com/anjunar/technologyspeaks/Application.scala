package com.anjunar.technologyspeaks

import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.technologyspeaks.control.User

import java.util
import scala.beans.BeanProperty

class Application(_user: User) {

  @PropertyDescriptor(title = "User")
  val user: User = _user

  def this() = this(null)

}
