package com.anjunar.technologyspeaks.shared

import com.anjunar.scala.schema.builder.{EntitySchemaBuilder, SchemaBuilder}
import com.anjunar.technologyspeaks.control.{Address, Credential, GeoPoint, User}

object AddressSchema {

  def static(builder: EntitySchemaBuilder[Address]): EntitySchemaBuilder[Address] = {

    builder
      .property("id")
      .property("street")
      .property("number")
      .property("zipCode")
      .property("country")
      .property("point", property => property
        .forType(classOf[GeoPoint], GeoPointSchema.static)
      )

  }


  def dynamic(builder: EntitySchemaBuilder[Address], loaded : Address): EntitySchemaBuilder[Address] = {

    val current = User.current()
    val isOwnedOrAdmin = Credential.current().hasRole("Administrator") || loaded != null && current == loaded.user.owner

    builder
      .property("id")
      .property("street", property => property
        .withWriteable(isOwnedOrAdmin)
      )
      .property("number", property => property
        .withWriteable(isOwnedOrAdmin)
      )
      .property("zipCode", property => property
        .withWriteable(isOwnedOrAdmin)
      )
      .property("country", property => property
        .withWriteable(isOwnedOrAdmin)
      )
      .property("point", property => property
        .forType(classOf[GeoPoint], GeoPointSchema.static)
      )

  }

}
