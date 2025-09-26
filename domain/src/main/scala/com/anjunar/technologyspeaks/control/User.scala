package com.anjunar.technologyspeaks.control

import com.anjunar.jaxrs.types.OwnerProvider
import com.anjunar.jpa.annotations.{PostgresIndex, PostgresIndices}
import com.anjunar.jpa.{EntityContext, RepositoryContext}
import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.scala.schema.model.Link
import com.anjunar.security.SecurityUser
import com.anjunar.technologyspeaks.document.Document
import com.anjunar.technologyspeaks.shared.property.{EntityView, ManagedProperty, ManagedRule, ViewContext}
import com.anjunar.vertx.engine.{EntitySchemaDef, OwnerRule, RequestContext, SchemaProvider, SchemaView, VisibilityRule}
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
class User extends Identity with OwnerProvider with SecurityUser with EntityContext[User] {

  @Size(min = 3, max = 80)
  @PropertyDescriptor(title = "Nickname", naming = true)
  @Column(unique = true)
  @Basic
  @FormParam("nickName")
  @NotBlank
  var nickName: String = uninitialized

  @OneToMany(cascade = Array(CascadeType.ALL), mappedBy = "user", orphanRemoval = true)
  @PropertyDescriptor(title = "Emails", widget = "form-array")
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

object User extends RepositoryContext[User](classOf[User]) with SchemaProvider[User] with ViewContext {

  val schema = new EntitySchemaDef[User](classOf[User]) {
    val id = column[UUID]("id", views = Set("full", "application", "form", "table"))
    val nickName = column[String]("nickName", views = Set("full", "application", "form", "table"))
      .visibleWhen(OwnerRule())
    val emails = column[util.Set[EMail]]("emails")
      .forType(ctx => EMail.schema.buildType(classOf[EMail], ctx))
      .forInstance((emails, ctx, factory) => emails.asScala.map(elem => EMail.schema.build(elem, classOf[EMail], ctx, factory)).toSeq)
      .visibleWhen(ManagedRule(classOf[User]))
      .withDynamicLinks((user, ctx, session) => {
        User.findByUser(user)(using session)
          .thenCompose(view => {
            val property = view.findProperty("emails")
            if (property == null) {
              val newManagedProperty = new ManagedProperty()
              newManagedProperty.value = "emails"
              newManagedProperty.view = view

              session.persist(newManagedProperty)
                .thenApply(_ => {
                  Link(s"/property/${newManagedProperty.id.toString}", "GET", "security", "Security")
                })
            } else {
              CompletableFuture.completedFuture(Link(s"/property/${property.id.toString}", "GET", "security", "Security"))
            }
          })
      })
    val info = column[UserInfo]("info", views = Set("full", "application", "form", "table"))
      .forType(ctx => UserInfo.schema.buildType(classOf[UserInfo], ctx))
      .forInstance((userInfo, ctx, factory) => Seq(UserInfo.schema.build(userInfo, classOf[UserInfo], ctx, factory)))
      .visibleWhen(ManagedRule(classOf[User]))
      .withDynamicLinks((user, ctx, session) => {
        User.findByUser(user)(using session)
          .thenCompose(view => {
            val property = view.findProperty("info")
            if (property == null) {
              val newManagedProperty = new ManagedProperty()
              newManagedProperty.value = "info"
              newManagedProperty.view = view

              session.persist(newManagedProperty)
                .thenApply(_ => {
                  Link(s"/property/${newManagedProperty.id.toString}", "GET", "security", "Security")
                })
            } else {
              CompletableFuture.completedFuture(Link(s"/property/${property.id.toString}", "GET", "security", "Security"))
            }
          })
      })
    val address = column[Address]("address", views = Set("full", "form"))
      .forType(ctx => Address.schema.buildType(classOf[Address], ctx))
      .forInstance((address, ctx, factory) => Seq(Address.schema.build(address, classOf[Address], ctx, factory)))
      .visibleWhen(ManagedRule(classOf[User]))
      .withDynamicLinks((user, ctx, session) => {
        User.findByUser(user)(using session)
          .thenCompose(view => {
            val property = view.findProperty("address")
            if (property == null) {
              val newManagedProperty = new ManagedProperty()
              newManagedProperty.value = "address"
              newManagedProperty.view = view

              session.persist(newManagedProperty)
                .thenApply(_ => {
                  Link(s"/property/${newManagedProperty.id.toString}", "GET", "security", "Security")
                })
            } else {
              CompletableFuture.completedFuture(Link(s"/property/${property.id.toString}", "GET", "security", "Security"))
            }
          })
      })
  }

  def findByEmail(email: String)(implicit session : Stage.Session): CompletionStage[User] = {
    session.createQuery("select u from User u join u.emails e where e.value = :value", classOf[User])
      .setParameter("value", email)
      .getSingleResult
  }

  def findByUser(user: User)(implicit session: Stage.Session): CompletionStage[View] = {
    if (user == null) {
      CompletableFuture.completedFuture(new View())
    } else {
      session.createQuery("select v from UserView v left join fetch v.properties where v.user = :user", classOf[View])
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

  @Entity(name = "UserView")
  class View extends EntityView with EntityContext[View] {
    override def toString = s"View()"
  }

}