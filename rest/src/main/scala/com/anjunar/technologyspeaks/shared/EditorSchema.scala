package com.anjunar.technologyspeaks.shared

import com.anjunar.scala.mapper.file.File
import com.anjunar.scala.schema.builder.EntitySchemaBuilder
import com.anjunar.technologyspeaks.shared.editor.*

object EditorSchema {

  def static(builder: EntitySchemaBuilder[Editor]): EntitySchemaBuilder[Editor] = {
    builder
      .property("id")
      .property("files", property => property
        .withWriteable(true)
        .forType(classOf[File], (builder: EntitySchemaBuilder[File]) => builder
          .property("id")
          .property("name", property => property
            .withWriteable(true)
          )
          .property("contentType", property => property
            .withWriteable(true)
          )
          .property("data", property => property
            .withWriteable(true)
          )
        )
      )
      .property("markdown", property => property
        .withWidget("textarea")
        .withWriteable(true)
      )
      .property("json")
      .property("changes", property => property
        .forType(classOf[Change], (builder: EntitySchemaBuilder[Change]) => builder
          .property("action")
          .property("nodeType")
          .property("oldValue")
          .property("newValue")
          .property("value")
          .property("offset")
        )
      )
  }

}
