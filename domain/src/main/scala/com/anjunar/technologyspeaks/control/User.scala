package com.anjunar.technologyspeaks.control

import com.anjunar.jaxrs.types.OwnerProvider
import com.anjunar.jpa.RepositoryContext
import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.security.SecurityUser
import com.anjunar.jpa.{PostgresIndex, PostgresIndices}
import com.anjunar.scala.schema.engine.{EntitySchemaDef, Link, RequestContext, SchemaView, VisibilityRule}
import com.anjunar.technologyspeaks.shared.property.EntityView
import io.smallrye.mutiny.Uni
import jakarta.persistence.*
import jakarta.validation.constraints.*
import jakarta.ws.rs.FormParam

import java.time.LocalDate
import java.util
import java.util.concurrent.{CompletableFuture, CompletionStage}
import java.util.{Objects, UUID}
import scala.compiletime.uninitialized


@Entity
@PostgresIndices(Array(
  new PostgresIndex(name = "user_idx_nickName", columnList = "nickName", using = "GIN")
))
class User extends Identity with OwnerProvider with SecurityUser {

  @Size(min = 3, max = 80)
  @PropertyDescriptor(title = "Nickname", naming = true)
  @Column(unique = true)
  @Basic
  @FormParam("nickName")
  var nickName: String = uninitialized

  @OneToMany(cascade = Array(CascadeType.ALL), mappedBy = "user")
  @PropertyDescriptor(title = "Emails", widget = "form-array", writeable = true)
  val emails: util.Set[EMail] = new util.HashSet[EMail]()

  @OneToOne(cascade = Array(CascadeType.ALL), orphanRemoval = true, targetEntity = classOf[UserInfo])
  @PropertyDescriptor(title = "Info", naming = true)
  var info: UserInfo = uninitialized

  @OneToOne(cascade = Array(CascadeType.ALL), orphanRemoval = true, targetEntity = classOf[Address])
  @PropertyDescriptor(title = "Address")
  var address: Address = uninitialized

  override def owner: User = this

  override def toString = s"User($nickName)"
}

object User extends RepositoryContext[User](classOf[User]) {

  object NicknameRule extends VisibilityRule[User] {
    override def isVisible(entity: User, property: String, ctx: RequestContext): Boolean = true
    override def isWriteable(entity: User, property: String, ctx: RequestContext): Boolean = {
      ctx.currentUser.id == entity.id || ctx.roles.contains("Administrator")
    }
  }

  object ManagedRule extends VisibilityRule[User] {
    override def isVisible(entity: User, property: String, ctx: RequestContext): Boolean = true

    override def isWriteable(entity: User, property: String, ctx: RequestContext): Boolean = {
      ctx.currentUser.id == entity.id || ctx.roles.contains("Administrator")
    }
  }

  val schema = new EntitySchemaDef[User]("User") {
    val id = column[UUID]("id", views = Set(SchemaView.Full, SchemaView.Compact))
    val nickName = column[String]("nickName", views = Set(SchemaView.Full, SchemaView.Compact))
      .visibleWhen(NicknameRule)
    val emails = column[EMail]("emails")
      .forType((email, ctx) => EMail.schema.build(email, ctx))
    val info = column[UserInfo]("info")
      .forType((userInfo, ctx) => UserInfo.schema.build(userInfo, ctx))
      .visibleWhen(ManagedRule)
    val address = column[Address]("address")
      .forType((address, ctx) => Address.schema.build(address, ctx))
      .visibleWhen(ManagedRule)
  }

  def current(): User = {
    val token = Credential.current()
    token.email.user
  }

  def findByEmail(email: String): CompletionStage[User] = {
    User.withTransaction { session =>
      session.createQuery("select u from User u join u.emails e where e.value = :value", classOf[User])
        .setParameter("value", email)
        .getSingleResult
    }
  }

  @Entity(name = "UserView")
  class View extends EntityView {

    override def toString = s"View()"
  }

  object View extends RepositoryContext[View](classOf[View]) {
    def findByUser(user: User): CompletionStage[View] = {
      User.View.withTransaction { session =>
        session.createQuery("select v from UserView v where v.user = :user", classOf[View])
          .setParameter("user", user)
          .getSingleResultOrNull
          .thenCompose(view => {
            if (view != null) {
              CompletableFuture.completedFuture(view)
            } else {
              val newView = new View()
              newView.user = user
              session.persist(newView).thenApply(_ => newView)
            }
          })
      }
    }
  }

}