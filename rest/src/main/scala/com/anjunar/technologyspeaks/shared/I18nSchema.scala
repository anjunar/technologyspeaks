package com.anjunar.technologyspeaks.shared

import com.anjunar.scala.schema.builder.EntitySchemaBuilder
import com.anjunar.technologyspeaks.shared.i18n.{I18n, Translation}

object I18nSchema {

  def static(builder: EntitySchemaBuilder[I18n]): EntitySchemaBuilder[I18n] = {
    builder
      .property("id")
      .property("text")
      .property("translations", property => property
        .forType(classOf[Translation], (builder: EntitySchemaBuilder[Translation]) => builder
          .property("text")
          .property("locale")
        )
      )
  }

}
