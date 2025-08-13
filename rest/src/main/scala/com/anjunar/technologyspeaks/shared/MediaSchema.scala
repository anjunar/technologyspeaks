package com.anjunar.technologyspeaks.shared

import com.anjunar.scala.schema.builder.{EntitySchemaBuilder, SchemaBuilder}
import com.anjunar.technologyspeaks.media.{Media, Thumbnail}

object MediaSchema {

  def static(builder: EntitySchemaBuilder[Media], isOwnedOrAdmin: Boolean) : EntitySchemaBuilder[Media] = {
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
        .property("thumbnail", property => property
          .withWriteable(isOwnedOrAdmin)
          .forType(classOf[Thumbnail], ThumbnailSchema.static(_, isOwnedOrAdmin))
        )

  }


}
