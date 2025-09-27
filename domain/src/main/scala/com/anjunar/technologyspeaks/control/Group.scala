package com.anjunar.technologyspeaks.control

import com.anjunar.jaxrs.types.OwnerProvider
import com.anjunar.jpa.RepositoryContext
import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.security.SecurityUser
import jakarta.persistence.{Basic, Entity, ManyToMany, ManyToOne, Table}
import com.anjunar.technologyspeaks.shared.AbstractEntity
import com.anjunar.vertx.engine.{EntitySchemaDef, SchemaProvider}
import jakarta.validation.constraints.{NotEmpty, Size}

import scala.beans.BeanProperty
import scala.compiletime.uninitialized
import java.util

@Entity
@Table(name = "groups")
class Group extends AbstractEntity with OwnerProvider {


  @Size(min = 3, max = 80)
  @NotEmpty
  @PropertyDescriptor(title = "Name", naming = true)
  @Basic
  var name : String = uninitialized

  @Size(min = 0, max = 80)
  @PropertyDescriptor(title = "Description")
  @Basic
  var description : String = uninitialized

  @ManyToOne(optional = false, targetEntity = classOf[User])
  var user : User = uninitialized

  @ManyToMany(targetEntity = classOf[User])
  @PropertyDescriptor(title = "Users")
  val users : util.Set[User] = new util.HashSet[User]()

  override def owner : SecurityUser = user

  override def toString = s"Group($name, $description)"
}

object Group extends RepositoryContext[Group](classOf[Group]) with SchemaProvider[Group] {

  override val schema = EntitySchemaDef(classOf[Group]) 
    
}