package com.anjunar.technologyspeaks.document

import com.anjunar.jaxrs.types.AbstractSearch
import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.vertx.engine.{EntitySchemaDef, SchemaProvider}
import jakarta.ws.rs.QueryParam

import scala.compiletime.uninitialized

class DocumentSearch extends AbstractSearch {
  
  @PropertyDescriptor(title = "Text", writeable = true)
  @QueryParam("text")
  var text : String = uninitialized

}

object DocumentSearch extends SchemaProvider[DocumentSearch] {

  val schema = EntitySchemaDef(classOf[DocumentSearch])

}
