package com.anjunar.technologyspeaks.media

import com.anjunar.jpa.RepositoryContext
import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.technologyspeaks.control.User
import com.anjunar.vertx.engine.{EntitySchemaDef, SchemaProvider}
import jakarta.persistence.{CascadeType, Entity, OneToOne, Table}

import java.util.UUID
import scala.beans.BeanProperty
import scala.compiletime.uninitialized

@Entity
class Media extends Thumbnail {

  @OneToOne(cascade = Array(CascadeType.ALL), targetEntity = classOf[Thumbnail])
  @PropertyDescriptor(title = "Thumbnail", writeable = true)
  var thumbnail: Thumbnail = uninitialized

}

object Media extends RepositoryContext[Media](classOf[Media]) with SchemaProvider[Media] {

  val schema = EntitySchemaDef(classOf[Media])
  
}

