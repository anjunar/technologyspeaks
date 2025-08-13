package com.anjunar.technologyspeaks.shared

import com.anjunar.scala.schema.builder.{EntitySchemaBuilder, LinkContext, SchemaBuilder}
import com.anjunar.technologyspeaks.Application
import com.anjunar.technologyspeaks.control.User

object ApplicationSchema {

  def static(builder: EntitySchemaBuilder[Application]): EntitySchemaBuilder[Application] = {
    builder.property("user", property => property
      .forType(classOf[User], UserSchema.staticCompact)
    )
  }

}
