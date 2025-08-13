package com.anjunar.technologyspeaks.shared

import com.anjunar.scala.schema.builder.EntitySchemaBuilder
import com.anjunar.technologyspeaks.document.Revision
import com.anjunar.technologyspeaks.shared.editor.{Change, Editor}

object RevisionSchema {

  def static(builder: EntitySchemaBuilder[Revision]): EntitySchemaBuilder[Revision] = {
    builder
      .property("id")
      .property("title")
      .property("revision")
      .property("editor", property => property
        .forType(classOf[Editor], EditorSchema.static)
      )
  }

}
