package com.anjunar.technologyspeaks.shared.property

import com.anjunar.jaxrs.types.OwnerProvider
import com.anjunar.jpa.RepositoryContext
import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.scala.schema.model.Link
import com.anjunar.security.SecurityUser
import com.anjunar.technologyspeaks.control.{EMail, Group, User}
import com.anjunar.technologyspeaks.shared.AbstractEntity
import com.anjunar.vertx.engine.{EntitySchemaDef, SchemaProvider}
import io.smallrye.mutiny.Uni
import jakarta.persistence.{Basic, Column, Entity, ManyToMany, ManyToOne}
import jakarta.validation.constraints.Size
import org.hibernate.reactive.mutiny.Mutiny
import org.hibernate.reactive.stage.Stage

import java.util
import java.util.UUID
import java.util.concurrent.CompletableFuture
import scala.beans.BeanProperty
import scala.compiletime.uninitialized
import scala.jdk.CollectionConverters.*

@Entity
class ManagedProperty extends AbstractEntity with OwnerProvider {

  @ManyToOne(optional = false, targetEntity = classOf[EntityView])
  var view : EntityView = uninitialized

  @Size(min = 1, max = 80)
  @Column(nullable = false)
  @Basic
  var value : String = uninitialized

  @Column(nullable = false)
  @PropertyDescriptor(title = "Visible for all")
  @Basic
  var visibleForAll : Boolean = false

  @ManyToMany(targetEntity = classOf[Group])
  @PropertyDescriptor(title = "Allowed Groups")
  val groups : util.Set[Group] = new util.HashSet[Group]()

  @ManyToMany
  @PropertyDescriptor(title = "Allowed Users")
  val users : util.Set[User] = new util.HashSet[User]()

  override def owner: SecurityUser = view.user
  
  override def toString = s"ManagedProperty($value, $visibleForAll)"
}

object ManagedProperty extends RepositoryContext[ManagedProperty](classOf[ManagedProperty]) with SchemaProvider[ManagedProperty] {

  override val schema = new EntitySchemaDef(classOf[ManagedProperty]) {
    val id = column[UUID]("id")
    val visibleForAll = column[Boolean]("visibleForAll")
    val groups = column[util.Set[Group]]("groups")
      .forInstance((groups, ctx, session) => groups.asScala.map(elem => Group.schema.build(elem, classOf[Group], ctx, session)).toSeq)
      .forType(ctx => Group.schema.buildType(classOf[Group], ctx))
    val users = column[util.Set[User]]("users", views = Set("application"))
      .forInstance((users, ctx, session) => users.asScala.map(elem => User.schema.build(elem, classOf[User], ctx, session)).toSeq)
      .forType(ctx => User.schema.buildType(classOf[User], ctx))
      .withStaticLinks(() => Link("/service/control/users", "GET", "list", "Users"))
  }

  def managedView(session: Stage.Session, view: EntityView, propertyName: String) = {
    val property = view.findProperty(propertyName)
    if (property == null) {
      val newManagedProperty = new ManagedProperty()
      newManagedProperty.value = propertyName
      newManagedProperty.view = view
      view.properties.add(newManagedProperty)

      session.withTransaction(transaction => {
        session.persist(newManagedProperty)
          .thenApply(_ => {
            Link(s"/service/security/property/${newManagedProperty.id.toString}", "GET", "security", "Security")
          })
      })
    } else {
      CompletableFuture.completedFuture(Link(s"/service/security/property/${property.id.toString}", "GET", "security", "Security"))
    }
  }

}
