package com.anjunar.technologyspeaks.shared.property

import com.anjunar.jaxrs.types.OwnerProvider
import com.anjunar.jpa.RepositoryContext
import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.security.SecurityUser
import com.anjunar.technologyspeaks.control.{Group, User}
import com.anjunar.technologyspeaks.shared.AbstractEntity
import io.smallrye.mutiny.Uni
import jakarta.persistence.{Basic, Column, Entity, ManyToMany, ManyToOne}
import jakarta.validation.constraints.Size
import org.hibernate.reactive.mutiny.Mutiny

import java.util
import java.util.UUID
import scala.beans.BeanProperty
import scala.compiletime.uninitialized

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

object ManagedProperty extends RepositoryContext[ManagedProperty](classOf[ManagedProperty]) {

  def manageReactive(session: Mutiny.Session, currentUser: User, isOwnedOrAdmin: Boolean, view: EntityView, name: String): Uni[(Boolean, UUID)] = {
    if (view == null) {
      return Uni.createFrom().item((true, null.asInstanceOf[UUID]))
    }

    val propertyOpt = view.properties.stream()
      .filter(_.value == name)
      .findFirst()

    val propertyUni: Uni[ManagedProperty] = if (propertyOpt.isPresent) {
      Uni.createFrom().item(propertyOpt.get)
    } else {
      val property = new ManagedProperty()
      property.value = name
      property.view = view
      session.persist(property).map(_ => {
        view.properties.add(property)
        property
      })
    }

    propertyUni.map { managedProperty =>
      if (isOwnedOrAdmin) {
        (true, managedProperty.id)
      } else {
        if (managedProperty.visibleForAll) {
          (true, null)
        } else {
          val canSee = managedProperty.users.contains(currentUser) ||
            managedProperty.groups.stream().anyMatch(_.users.contains(currentUser))
          (canSee, null)
        }
      }
    }
  }


}
