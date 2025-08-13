package com.anjunar.technologyspeaks.shared

import com.anjunar.scala.schema.builder.{EntitySchemaBuilder, SchemaBuilder}
import com.anjunar.technologyspeaks.media.Thumbnail

object ThumbnailSchema {

  def static(builder: EntitySchemaBuilder[Thumbnail], isOwnedOrAdmin: Boolean): EntitySchemaBuilder[Thumbnail] = {
    builder
      .property("id")
      .property("name", property => property
        .withWriteable(isOwnedOrAdmin)
      )
      .property("contentType", property => property
        .withWriteable(isOwnedOrAdmin)
      )
      .property("data", property => property
        .withWriteable(isOwnedOrAdmin)
      )
  }

}
