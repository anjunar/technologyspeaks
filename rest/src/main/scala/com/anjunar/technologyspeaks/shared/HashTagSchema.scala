package com.anjunar.technologyspeaks.shared

import com.anjunar.scala.schema.builder.EntitySchemaBuilder
import com.anjunar.technologyspeaks.shared.hashtag.HashTag

object HashTagSchema {

  def static(builder: EntitySchemaBuilder[HashTag]): EntitySchemaBuilder[HashTag] = {
    builder
      .property("id")
      .property("value")
      .property("description")
  }


}
