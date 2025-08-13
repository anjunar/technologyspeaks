package com.anjunar.technologyspeaks.timeline

import com.anjunar.jaxrs.types.OwnerProvider
import com.anjunar.jpa.RepositoryContext
import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.security.SecurityUser
import com.anjunar.technologyspeaks.control.User
import com.anjunar.technologyspeaks.shared.AbstractEntity
import com.anjunar.technologyspeaks.shared.editor.{Editor, Root}
import jakarta.persistence.{CascadeType, Entity, ManyToOne, OneToOne}
import com.anjunar.jpa.{Save}

import scala.beans.BeanProperty
import scala.compiletime.uninitialized

@Entity
class Post extends AbstractEntity with OwnerProvider {

  @PropertyDescriptor(title = "User")
  @ManyToOne(optional = false, targetEntity = classOf[User])
  var user : User = uninitialized

  @PropertyDescriptor(title = "Editor", widget = "editor")
  @OneToOne(optional = false, cascade = Array(CascadeType.ALL), orphanRemoval = true, targetEntity = classOf[Editor])
  var editor : Editor = uninitialized

  override def owner: SecurityUser = user
}

object Post extends RepositoryContext[Post](classOf[Post])
