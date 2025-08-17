package com.anjunar.technologyspeaks

import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.vertx.engine.SchemaView.Compact
import com.anjunar.technologyspeaks.control.User
import com.anjunar.vertx.engine.EntitySchemaDef

import scala.compiletime.uninitialized

class Application {

  @PropertyDescriptor(title = "User")
  var user : User = uninitialized

} 

object Application {

  val schema = new EntitySchemaDef[Application]("Application") {
    val user = column[User]("user").forType((user, ctx) => User.schema.build(user, ctx, Compact))
  }
  
}
