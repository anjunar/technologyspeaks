package com.anjunar.technologyspeaks.document

import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.vertx.engine.EntitySchemaDef

import scala.compiletime.uninitialized

class DocumentSearch {
  
  @PropertyDescriptor(title = "Text", writeable = true)
  var text : String = uninitialized

}

object DocumentSearch {

  val schema = new EntitySchemaDef[DocumentSearch]("EMail") {
    val text = column[String]("text")
  }

}
