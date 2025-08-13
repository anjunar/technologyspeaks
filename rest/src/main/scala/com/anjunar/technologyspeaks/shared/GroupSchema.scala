package com.anjunar.technologyspeaks.shared

import com.anjunar.scala.schema.builder.{EntitySchemaBuilder, SchemaBuilder}
import com.anjunar.technologyspeaks.control.{Credential, Group, User}

import java.util

object GroupSchema {

  def static(builder: EntitySchemaBuilder[Group]): EntitySchemaBuilder[Group] = {
    builder
      .property("id")
      .property("name")
      .property("description")
  }

  def dynamic(builder: EntitySchemaBuilder[Group], loaded : Group): EntitySchemaBuilder[Group] = {

    val credential = Credential.current()
    val currentUser = User.current()
    val isOwnedOrAdmin = loaded.owner == currentUser || credential.hasRole("Administrator")

    builder
      .property("id")
      .property("name", property => property
        .withWriteable(isOwnedOrAdmin)
      )
      .property("description", property => property
        .withWriteable(isOwnedOrAdmin)
      )
      .property("users", property => property
        .withWriteable(isOwnedOrAdmin)
        .forType(classOf[User], builder => UserSchema.staticCompact(builder))
        .forInstance(loaded.users, classOf[User], (entity : User) => builder => UserSchema.dynamicCompact(builder, entity))
      )
  }


}
