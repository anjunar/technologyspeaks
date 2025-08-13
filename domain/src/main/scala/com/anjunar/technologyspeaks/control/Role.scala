package com.anjunar.technologyspeaks.control

import com.anjunar.jpa.RepositoryContext
import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.security.SecurityRole
import com.anjunar.technologyspeaks.shared.AbstractEntity
import jakarta.persistence.{Basic, Column, Entity}
import jakarta.validation.constraints.{NotBlank, Size}

import scala.compiletime.uninitialized


@Entity
class Role extends AbstractEntity with SecurityRole {

  @Size(min = 3, max = 80)
  @NotBlank
  @PropertyDescriptor(title = "Name", naming = true)
  @Column(unique = true)
  @Basic
  var name: String = uninitialized

  @Size(min = 3, max = 80)
  @NotBlank
  @PropertyDescriptor(title = "Description")
  @Basic
  var description: String = uninitialized

  override def toString = s"Role($name, $description)"
}

object Role extends RepositoryContext[Role](classOf[Role])
