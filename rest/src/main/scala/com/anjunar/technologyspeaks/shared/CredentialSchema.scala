package com.anjunar.technologyspeaks.shared

import com.anjunar.scala.schema.builder.EntitySchemaBuilder
import com.anjunar.technologyspeaks.control.{Credential, Role}

object CredentialSchema {

  def static(builder: EntitySchemaBuilder[Credential]): EntitySchemaBuilder[Credential] = {

    builder
      .property("id")
      .property("displayName")
      .property("roles", property => property
        .forType(classOf[Role], builder => RoleSchema.static(builder))
      )
  }

  def dynamic(builder: EntitySchemaBuilder[Credential], loaded : Credential): EntitySchemaBuilder[Credential] = {

    val credential = Credential.current()
    val isAdmin = credential.hasRole("Administrator")

    builder
      .property("id")
      .property("displayName")
      .property("roles", property => property
        .withWriteable(isAdmin)
        .forType(classOf[Role], builder => RoleSchema.static(builder))
        .forInstance(loaded.roles, classOf[Role], (entity : Role) => builder => RoleSchema.dynamic(builder, entity))
      )
  }


}
