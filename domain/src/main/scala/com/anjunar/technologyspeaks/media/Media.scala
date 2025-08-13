package com.anjunar.technologyspeaks.media

import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.technologyspeaks.control.User
import jakarta.persistence.{CascadeType, Entity, OneToOne, Table}

import scala.beans.BeanProperty
import scala.compiletime.uninitialized

@Entity
class Media extends Thumbnail {

  @OneToOne(cascade = Array(CascadeType.ALL), targetEntity = classOf[Thumbnail])
  @PropertyDescriptor(title = "Thumbnail")
  var thumbnail: Thumbnail = uninitialized

}


