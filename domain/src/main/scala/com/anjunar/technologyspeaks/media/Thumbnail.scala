package com.anjunar.technologyspeaks.media

import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.scala.mapper.file.File
import com.anjunar.technologyspeaks.shared.AbstractEntity
import com.anjunar.vertx.engine.{EntitySchemaDef, SchemaProvider}
import jakarta.persistence.*
import jakarta.validation.constraints.NotEmpty
import org.apache.commons.io.{FileUtils, IOUtils}

import scala.beans.BeanProperty
import scala.compiletime.uninitialized

@Entity
@Table(name = "media")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
class Thumbnail extends AbstractEntity with File {

  @PropertyDescriptor(title = "Name", naming = true)
  @Basic
  var name: String = uninitialized

  @PropertyDescriptor(title = "Content Type")
  @Basic
  @NotEmpty
  var contentType: String = uninitialized

  @PropertyDescriptor(title = "Data")
  @NotEmpty
  var data: Array[Byte] = uninitialized

}

object Thumbnail extends SchemaProvider[Thumbnail] {

  override val schema = EntitySchemaDef(classOf[Thumbnail])

}


