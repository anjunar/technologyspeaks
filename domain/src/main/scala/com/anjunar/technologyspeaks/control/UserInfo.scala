package com.anjunar.technologyspeaks.control

import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.technologyspeaks.media.Media
import com.anjunar.technologyspeaks.shared.AbstractEntity
import com.anjunar.jpa.{PostgresIndex, PostgresIndices, RepositoryContext}
import com.anjunar.vertx.engine.{EntitySchemaDef, RequestContext, SchemaProvider, SchemaView, VisibilityRule}
import jakarta.persistence.*
import jakarta.validation.constraints.{NotBlank, NotNull, Past, Size}
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

object UserInfo extends RepositoryContext[UserInfo](classOf[UserInfo]) with SchemaProvider[UserInfo] {

  object GlobalRule extends VisibilityRule[UserInfo] {
    override def isVisible(entity: UserInfo, property: String, ctx: RequestContext): Boolean = true

    override def isWriteable(entity: UserInfo, property: String, ctx: RequestContext): Boolean = {
      ctx.currentUser.get("id") == entity.user.id.toString || ctx.roles.contains("Administrator")
    }
  }

  val schema = new EntitySchemaDef[UserInfo]("UserInfo") {
    val id = column[UUID]("id")
      .visibleWhen(GlobalRule)
    val firstName = column[String]("firstName")
      .visibleWhen(GlobalRule)
    val lastName = column[String]("lastName")
      .visibleWhen(GlobalRule)
    val image = column[Media]("image")
      .forType(ctx => Media.schema.buildType(classOf[Media], ctx))
      .forInstance((media, ctx) => Seq(Media.schema.build(media, ctx)))
      .visibleWhen(GlobalRule)
    val birthDate = column[LocalDate]("birthDate")
      .visibleWhen(GlobalRule)
  }
}
