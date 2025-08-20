package com.anjunar.technologyspeaks

import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.vertx.engine.SchemaView.{Compact, Full}
import com.anjunar.technologyspeaks.control.User
import com.anjunar.vertx.engine.{EntitySchemaDef, SchemaProvider}

import scala.compiletime.uninitialized

class Application {

  @PropertyDescriptor(title = "User")
  var user : User = uninitialized

} 

object Application extends SchemaProvider[Application] {

  val schema = new EntitySchemaDef[Application]("Application") {
    val user = column[User]("user")
      .forType(ctx => User.schema.buildType(classOf[User], ctx, Full))
      .forInstance((user, ctx) => Seq(User.schema.build(user, ctx, Full)))
  }
  
}
