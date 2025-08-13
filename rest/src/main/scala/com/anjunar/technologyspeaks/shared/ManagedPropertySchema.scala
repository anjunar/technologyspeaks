package com.anjunar.technologyspeaks.shared

import com.anjunar.scala.schema.builder.{EntitySchemaBuilder, SchemaBuilder}
import com.anjunar.technologyspeaks.control.*
import com.anjunar.technologyspeaks.shared.property.ManagedProperty

object ManagedPropertySchema {

  def dynamic(builder: EntitySchemaBuilder[ManagedProperty], loaded : ManagedProperty) : EntitySchemaBuilder[ManagedProperty] = {

    val current = User.current()
    val isOwnedOrAdmin = current == loaded.view.owner || Credential.current().hasRole("Administrator")


    builder
      .property("id")
      .property("visibleForAll", property => property
        .withWriteable(isOwnedOrAdmin)
      )
      .property("users", property => property
        .withWriteable(isOwnedOrAdmin)
        .forInstance(loaded.users, classOf[User], (entity : User) => builder => UserSchema.dynamicCompact(builder, entity))
      )
      .property("groups", property => property
        .withWriteable(isOwnedOrAdmin)
        .forType(classOf[Group], builder => GroupSchema.static(builder))
      )
  }

}
