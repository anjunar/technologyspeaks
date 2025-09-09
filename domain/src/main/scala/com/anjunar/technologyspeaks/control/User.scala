package com.anjunar.technologyspeaks.control

import com.anjunar.jaxrs.types.OwnerProvider
import com.anjunar.jpa.{EntityContext, PostgresIndex, PostgresIndices, RepositoryContext}
import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.security.SecurityUser
import com.anjunar.technologyspeaks.document.Document
import com.anjunar.technologyspeaks.shared.property.{EntityView, ManagedProperty}
import com.anjunar.vertx.engine.{EntitySchemaDef, Link, RequestContext, SchemaProvider, SchemaView, VisibilityRule}
import io.smallrye.mutiny.Uni
import jakarta.persistence.*
import jakarta.validation.constraints.*
import jakarta.ws.rs.FormParam
import org.hibernate.reactive.stage.Stage

import java.time.LocalDate
import java.util
import java.util.concurrent.{CompletableFuture, CompletionStage}
import java.util.{Objects, UUID}
import scala.compiletime.uninitialized
import scala.jdk.CollectionConverters.*

@Entity
@PostgresIndices(Array(
  new PostgresIndex(name = "user_idx_nickName", columnList = "nickName", using = "GIN")
))
@NamedEntityGraph(
  name = "User.full",
  attributeNodes = Array(
    new NamedAttributeNode("emails"),
    new NamedAttributeNode("info"),
    new NamedAttributeNode("address")
  )
)
class User extends Identity with OwnerProvider with SecurityUser with EntityContext[User]  {

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

object User extends RepositoryContext[User](classOf[User]) with SchemaProvider[User] {

  object NicknameRule extends VisibilityRule[User] {
    override def isVisible(entity: User, property: String, ctx: RequestContext, session : Stage.Session): CompletionStage[Boolean] = CompletableFuture.completedFuture(true)
    override def isWriteable(entity: User, property: String, ctx: RequestContext, session : Stage.Session): CompletionStage[Boolean] = {
      CompletableFuture.completedFuture(ctx.currentUser.get("id") == entity.id.toString || ctx.roles.contains("Administrator"))
    }
  }

  object ManagedRule extends VisibilityRule[User] {

    override def isVisible(entity: User, property: String, ctx: RequestContext, session: Stage.Session): CompletionStage[Boolean] = {
      if (entity.id.toString == ctx.currentUser.get("id") || ctx.roles.contains("Administrator")) {
        CompletableFuture.completedFuture(true)
      } else {
        User.find(UUID.fromString(ctx.currentUser.get("id")))(using session)
          .thenCompose(currentUser =>
            User.View.findByUser(currentUser)(using session)
              .thenCompose(view => {
                val opt = view.properties.stream()
                  .filter(p => p.value == property)
                  .findFirst()

                if opt.isPresent then {
                  val managedProperty = opt.get
                  CompletableFuture.completedFuture(checkVisibility(managedProperty, ctx))
                } else {
                  val managedProperty = new ManagedProperty
                  managedProperty.view = view
                  managedProperty.value = property

                  session.withTransaction(transaction => {
                    session.persist(managedProperty).thenApply(_ => {
                      checkVisibility(managedProperty, ctx)
                    })
                  })
                }
              })
          )
      }
    }

    private def checkVisibility(managedProperty: ManagedProperty, ctx: RequestContext): Boolean = {
      val userId = ctx.currentUser.get("id")
      val visibleForAll = managedProperty.visibleForAll
      val isInUsers = managedProperty.users.stream().anyMatch(user => user.id.toString == userId)
      val isInGroup = managedProperty.groups.stream().anyMatch(group =>
        group.users.stream().anyMatch(user => user.id.toString == userId)
      )

      visibleForAll || isInUsers || isInGroup
    }

    override def isWriteable(entity: User, property: String, ctx: RequestContext, session : Stage.Session): CompletionStage[Boolean] = {
      CompletableFuture.completedFuture(ctx.currentUser.get("id") == entity.id.toString || ctx.roles.contains("Administrator"))
    }
  }

  val schema = new EntitySchemaDef[User](classOf[User]) {
    val id = column[UUID]("id", views = Set(SchemaView.Full, SchemaView.Compact))
    val nickName = column[String]("nickName", views = Set(SchemaView.Full, SchemaView.Compact))
      .visibleWhen(NicknameRule)
    val emails = column[util.Set[EMail]]("emails")
      .forType(ctx => EMail.schema.buildType(classOf[EMail], ctx))
      .forInstance((emails, ctx, session) => emails.asScala.map(elem => EMail.schema.build(elem, ctx, session)).toSeq)
      .visibleWhen(ManagedRule)
    val info = column[UserInfo]("info")
      .forType(ctx => UserInfo.schema.buildType(classOf[UserInfo], ctx))
      .forInstance((userInfo, ctx, session) => Seq(UserInfo.schema.build(userInfo, ctx, session)))
      .visibleWhen(ManagedRule)
    val address = column[Address]("address")
      .forType(ctx => Address.schema.buildType(classOf[Address], ctx))
      .forInstance((address, ctx, session) => Seq(Address.schema.build(address, ctx, session)))
      .visibleWhen(ManagedRule)
  }

  def findByEmail(email: String)(implicit session : Stage.Session): CompletionStage[User] = {
    session.createQuery("select u from User u join u.emails e where e.value = :value", classOf[User])
      .setParameter("value", email)
      .getSingleResult
  }

  @Entity(name = "UserView")
  class View extends EntityView with EntityContext[View] {

    override def toString = s"View()"
  }

  object View extends RepositoryContext[View](classOf[View]) {
    def findByUser(user: User)(implicit session : Stage.Session): CompletionStage[View] = {
      session.createQuery("select v from UserView v where v.user = :user", classOf[View])
        .setParameter("user", user)
        .getSingleResultOrNull
        .thenCompose(view => {
          if (view != null) {
            CompletableFuture.completedFuture(view)
          } else {
            val newView = new View()
            newView.user = user
            session.withTransaction(transaction => {
              newView.persist().thenApply(_ => newView)
            })
          }
        })
    }
  }

}