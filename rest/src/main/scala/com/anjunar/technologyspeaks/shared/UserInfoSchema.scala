package com.anjunar.technologyspeaks.shared

import com.anjunar.scala.schema.builder.{EntitySchemaBuilder, SchemaBuilder}
import com.anjunar.technologyspeaks.control.{Credential, User, UserInfo}
import com.anjunar.technologyspeaks.media.Media

object UserInfoSchema {

  def static(builder: EntitySchemaBuilder[UserInfo]): EntitySchemaBuilder[UserInfo] = {
    builder
      .property("id")
      .property("firstName")
      .property("lastName")
  }

  def dynamic(builder: EntitySchemaBuilder[UserInfo], loaded : UserInfo): EntitySchemaBuilder[UserInfo] = {

    val current = User.current()
    val isOwnedOrAdmin = Credential.current().hasRole("Administrator") || (loaded != null && current == loaded.user.owner)

    builder
      .property("id")
      .property("firstName", property => property
        .withWriteable(isOwnedOrAdmin)
      )
      .property("lastName", property => property
        .withWriteable(isOwnedOrAdmin)
      )
      .property("image", property => property
        .withWriteable(isOwnedOrAdmin)
        .forType(classOf[Media], MediaSchema.static(_, isOwnedOrAdmin))
      )
      .property("birthDate", property => property
        .withWriteable(isOwnedOrAdmin)
      )

  }

}
