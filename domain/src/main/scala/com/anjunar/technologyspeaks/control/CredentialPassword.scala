package com.anjunar.technologyspeaks.control

import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import jakarta.persistence.{Basic, Entity}

import scala.compiletime.uninitialized

@Entity
class CredentialPassword extends Credential {

  @Basic
  @PropertyDescriptor(title = "Password")
  var password : String = uninitialized

}
