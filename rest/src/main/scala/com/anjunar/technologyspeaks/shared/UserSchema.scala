package com.anjunar.technologyspeaks.shared

import com.anjunar.scala.mapper.annotations.JsonSchema
import com.anjunar.scala.schema.builder.{EntitySchemaBuilder, LinkContext, PropertyBuilder, SchemaBuilder}
import com.anjunar.technologyspeaks.control.*
import com.anjunar.technologyspeaks.media.{Media, Thumbnail}
import com.anjunar.technologyspeaks.shared.property.{EntityView, ManagedProperty}
import jakarta.validation.constraints.Email

import java.util.{Optional, UUID}

object UserSchema {

  def staticCompact(builder: EntitySchemaBuilder[User]): EntitySchemaBuilder[User] = {
    builder
      .property("nickName")
      .property("info", property => property
        .forType(classOf[UserInfo], UserInfoSchema.static)
      )
  }

  def static(builder: EntitySchemaBuilder[User]): Unit = {
    builder
      .property("id")
      .property("nickName")
      .property("deleted")
      .property("emails", property => property
        .forType(classOf[EMail], EMailSchema.static)
      )
      .property("enabled")
      .property("info", property => property
        .forType(classOf[UserInfo], UserInfoSchema.static)
      )
      .property("address", property => property
        .forType(classOf[Address], AddressSchema.static)
      )

  }

  def dynamicCompact(builder: EntitySchemaBuilder[User], loaded : User): EntitySchemaBuilder[User] = {
    val token = Credential.current()

    val currentUser = token.email.user

    val isOwnedOrAdmin = loaded != null && (currentUser == loaded.owner || token.hasRole("Administrator"))
    val view = User.View.findByUser(currentUser)

    builder
      .property("id")
      .property("nickName")
      .property("info", property => property
        .forType(classOf[UserInfo], UserInfoSchema.static)
      )
  }

  def dynamic(builder: EntitySchemaBuilder[User], loaded: User): Unit = {
    val token = Credential.current()

    val currentUser = token.email.user

    val isOwnedOrAdmin = currentUser == loaded || token.hasRole("Administrator")
    val view = User.View.findByUser(loaded)

    builder
        .property("id")
        .property("nickName", property => property
          .withWriteable(isOwnedOrAdmin)
        )
        .property("deleted")
        .property("emails", property => property
          .forType(classOf[EMail], EMailSchema.static(_))
        )
        .property("enabled", property => property
          .withWriteable(isOwnedOrAdmin)
        )
        .property("info", property => property
          .withWriteable(isOwnedOrAdmin)
          .forType(classOf[UserInfo], UserInfoSchema.dynamic(_, loaded.info))
        )
        .property("address", property => property
          .withWriteable(isOwnedOrAdmin)
          .forType(classOf[Address], AddressSchema.dynamic(_, loaded.address))
        )

  }

}
