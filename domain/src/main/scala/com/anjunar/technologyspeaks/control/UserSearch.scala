package com.anjunar.technologyspeaks.control

import com.anjunar.jaxrs.types.AbstractSearch
import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.vertx.engine.{DefaultRule, EntitySchemaDef, SchemaProvider}
import jakarta.ws.rs.QueryParam

import scala.compiletime.uninitialized

class UserSearch extends AbstractSearch {

  @PropertyDescriptor(title = "Text", writeable = true)
  @QueryParam("nickName")
  var nickName: String = uninitialized


}

object UserSearch extends SchemaProvider[UserSearch] {

  val schema = EntitySchemaDef(classOf[UserSearch])

}

