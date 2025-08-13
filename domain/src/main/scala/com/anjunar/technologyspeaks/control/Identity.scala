package com.anjunar.technologyspeaks.control


import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.technologyspeaks.shared.AbstractEntity
import jakarta.persistence.*
import jakarta.validation.constraints.NotNull

import scala.beans.BeanProperty


@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
class Identity extends AbstractEntity {

  @PropertyDescriptor(title = "Active")
  @Basic
  var enabled: Boolean = false

  @PropertyDescriptor(title = "Deleted")
  @Basic
  var deleted : Boolean = false

}
