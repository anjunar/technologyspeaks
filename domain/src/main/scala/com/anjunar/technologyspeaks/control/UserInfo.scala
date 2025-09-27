package com.anjunar.technologyspeaks.control

import com.anjunar.jaxrs.types.OwnerProvider
import com.anjunar.jpa.annotations.{PostgresIndex, PostgresIndices}
import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.technologyspeaks.media.Media
import com.anjunar.technologyspeaks.shared.AbstractEntity
import com.anjunar.jpa.RepositoryContext
import com.anjunar.security.SecurityUser
import com.anjunar.vertx.engine.{EntitySchemaDef, OwnerRule, RequestContext, SchemaProvider, SchemaView, VisibilityRule}
import jakarta.persistence.*
import jakarta.validation.constraints.{NotBlank, NotEmpty, NotNull, Past, Size}
import jakarta.ws.rs.FormParam

import java.time.LocalDate
import java.util.UUID
import scala.beans.BeanProperty
import scala.compiletime.uninitialized


@Entity
@PostgresIndices(Array(
  new PostgresIndex(name = "user_idx_firstName", columnList = "firstName", using = "GIN"),
  new PostgresIndex(name = "user_idx_lastName", columnList = "lastName", using = "GIN")
))
class UserInfo extends AbstractEntity with OwnerProvider {

  @OneToOne(targetEntity = classOf[User])
  var user : User = uninitialized

  @Size(min = 3, max = 80)
  @PropertyDescriptor(title = "First Name", naming = true)
  @Basic
  @FormParam("firstName")
  @NotBlank
  var firstName : String = uninitialized
  
  @Size(min = 3, max = 80)
  @PropertyDescriptor(title = "Last Name", naming = true)
  @Basic
  @FormParam("lastName")
  @NotBlank
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

  override def owner: SecurityUser = user

  override def toString = s"UserInfo($firstName, $lastName, $birthDate)"
}

object UserInfo extends RepositoryContext[UserInfo](classOf[UserInfo]) with SchemaProvider[UserInfo] {

  val schema = EntitySchemaDef(classOf[UserInfo], OwnerRule[UserInfo]())
  
}