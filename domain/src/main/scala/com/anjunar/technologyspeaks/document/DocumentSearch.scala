package com.anjunar.technologyspeaks.document

import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.vertx.engine.EntitySchemaDef
import jakarta.ws.rs.QueryParam

import scala.compiletime.uninitialized

class DocumentSearch {
  
  @PropertyDescriptor(title = "Text", writeable = true)
  @QueryParam("text")  
  var text : String = uninitialized

}

object DocumentSearch {

  val schema = new EntitySchemaDef[DocumentSearch]("DocumentSearch") {
    val text = column[String]("text")
  }

}
