package com.anjunar.technologyspeaks.shared.property

import com.anjunar.jaxrs.types.OwnerProvider
import com.anjunar.security.SecurityUser
import com.anjunar.technologyspeaks.control.User
import com.anjunar.technologyspeaks.shared.AbstractEntity
import jakarta.persistence.*

import java.util
import scala.beans.BeanProperty
import scala.compiletime.uninitialized

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
abstract class EntityView extends AbstractEntity with OwnerProvider {

  @ManyToOne(optional = false, targetEntity = classOf[User])
  var user : User = uninitialized

  @OneToMany(cascade = Array(CascadeType.ALL), orphanRemoval = true, targetEntity = classOf[ManagedProperty], fetch = FetchType.EAGER)
  var properties : util.Set[ManagedProperty] = new util.HashSet[ManagedProperty]()
  
  def findProperty(name : String): ManagedProperty = {
    properties.stream()
      .filter(property => property.value == name)  
      .findFirst()
      .orElse(null)
  }

  override def owner: SecurityUser = user

}
