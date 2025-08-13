package com.anjunar.technologyspeaks.shared

import com.anjunar.scala.schema.builder.{EntitySchemaBuilder, SchemaBuilder}
import com.anjunar.technologyspeaks.control.EMail

object EMailSchema {

  def static(builder: EntitySchemaBuilder[EMail]): EntitySchemaBuilder[EMail] = {
    builder
      .property("id")
      .property("value", property => property
        .withWriteable(true)
      )
  }


}
