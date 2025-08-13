package com.anjunar.technologyspeaks.shared

import com.anjunar.scala.schema.builder.{EntitySchemaBuilder, LinkContext, SchemaBuilder}
import com.anjunar.technologyspeaks.control.{Credential, Role, User}

object RoleSchema {

  def static(builder: EntitySchemaBuilder[Role]): EntitySchemaBuilder[Role] = {
    builder
      .property("id")
      .property("name")
      .property("description")
  }

  def dynamic(builder: EntitySchemaBuilder[Role], loaded : Role): EntitySchemaBuilder[Role] = {

    val credential = Credential.current()
    val isAdmin = credential.hasRole("Administrator")

    builder
      .property("id")
      .property("name", property => property
        .withWriteable(isAdmin)
      )
      .property("description", property => property
        .withWriteable(isAdmin)
      )
  }


}
