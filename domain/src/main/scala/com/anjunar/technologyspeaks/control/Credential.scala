package com.anjunar.technologyspeaks.control

import com.anjunar.jaxrs.types.OwnerProvider
import com.anjunar.jpa.RepositoryContext
import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.security.{IdentityContext, SecurityCredential, SecurityUser}
import com.anjunar.technologyspeaks.shared.AbstractEntity
import jakarta.enterprise.inject.spi.CDI
import jakarta.persistence.{CascadeType, Column, Entity, Inheritance, InheritanceType, ManyToMany, ManyToOne, NoResultException}
import jakarta.validation.constraints.Size

import java.security.SecureRandom
import scala.beans.BeanProperty
import scala.compiletime.uninitialized
import java.util
import java.util.Base64

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
class Credential extends AbstractEntity with SecurityCredential with OwnerProvider {

  @ManyToMany(targetEntity = classOf[Role])
  @Size(min = 1, max = 10)
  @PropertyDescriptor(title = "Roles")
  val roles: util.Set[Role] = new util.HashSet[Role]

  @ManyToOne(targetEntity = classOf[EMail])
  @PropertyDescriptor(title = "Emails")
  var email : EMail = uninitialized

  override def hasRole(name: String): Boolean = roles.stream.anyMatch((role: Role) => role.name == name)

  override def user: SecurityUser = email.user

  override def owner: SecurityUser = user

  def validated : Boolean = hasRole("User") || hasRole("Administrator")

}

object Credential extends RepositoryContext[Credential](classOf[Credential]){
  
}