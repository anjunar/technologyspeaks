package com.anjunar.technologyspeaks.control

import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.technologyspeaks.media.Media
import com.anjunar.technologyspeaks.shared.AbstractEntity
import com.anjunar.jpa.{PostgresIndex, PostgresIndices}
import jakarta.persistence.*
import jakarta.validation.constraints.{NotBlank, NotNull, Past, Size}
import jakarta.ws.rs.FormParam

import java.time.LocalDate
import scala.beans.BeanProperty
import scala.compiletime.uninitialized


@Entity
@PostgresIndices(Array(
  new PostgresIndex(name = "user_idx_firstName", columnList = "firstName", using = "GIN"),
  new PostgresIndex(name = "user_idx_lastName", columnList = "lastName", using = "GIN")
))
class UserInfo extends AbstractEntity {

  @OneToOne(mappedBy = "info", targetEntity = classOf[User])
  var user : User = uninitialized

  @Size(min = 3, max = 80)
  @PropertyDescriptor(title = "First Name", naming = true)
  @Basic
  @FormParam("firstName")
  var firstName : String = uninitialized
  
  @Size(min = 3, max = 80)
  @PropertyDescriptor(title = "Last Name", naming = true)
  @Basic
  @FormParam("lastName")
  var lastName : String = uninitialized
  
  @ManyToOne(cascade = Array(CascadeType.ALL), targetEntity = classOf[Media])
  @PropertyDescriptor(title = "Picture", widget = "file")
  @FormParam("image")
  var image : Media = uninitialized
  
  @Past
  @PropertyDescriptor(title = "Birthdate")
  @Basic
  @FormParam("birthDate")
  var birthDate: LocalDate = uninitialized
  
  override def toString = s"UserInfo($firstName, $lastName, $birthDate)"
}
