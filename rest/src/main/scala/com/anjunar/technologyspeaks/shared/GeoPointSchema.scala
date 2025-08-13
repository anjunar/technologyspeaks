package com.anjunar.technologyspeaks.shared

import com.anjunar.scala.schema.builder.{EntitySchemaBuilder, SchemaBuilder}
import com.anjunar.technologyspeaks.control.GeoPoint

object GeoPointSchema {

  def static(builder: EntitySchemaBuilder[GeoPoint]): EntitySchemaBuilder[GeoPoint] = {
    builder
      .property("x")
      .property("y")

  }


}
