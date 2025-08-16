package com.anjunar.technologyspeaks.media

import com.anjunar.jpa.RepositoryContext
import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.scala.schema.engine.EntitySchemaDef
import com.anjunar.technologyspeaks.control.User
import jakarta.persistence.{CascadeType, Entity, OneToOne, Table}

import java.util.UUID
import scala.beans.BeanProperty
import scala.compiletime.uninitialized

@Entity
class Media extends Thumbnail {

  @OneToOne(cascade = Array(CascadeType.ALL), targetEntity = classOf[Thumbnail])
  @PropertyDescriptor(title = "Thumbnail")
  var thumbnail: Thumbnail = uninitialized

}

object Media extends RepositoryContext[Media](classOf[Media]) {

  val schema = new EntitySchemaDef[Media]("Media") {
    val id = column[UUID]("id")
    val name = column[String]("name")
    val contentType = column[String]("contentType")
    val data = column[Array[Byte]]("data")
  }

}

