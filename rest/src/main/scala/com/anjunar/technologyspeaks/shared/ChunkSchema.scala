package com.anjunar.technologyspeaks.shared

import com.anjunar.scala.schema.builder.{EntitySchemaBuilder, LinkContext, SchemaBuilder}
import com.anjunar.technologyspeaks.control.{Credential, User}
import com.anjunar.technologyspeaks.document.Chunk

object ChunkSchema {

  def static(builder: EntitySchemaBuilder[Chunk]): EntitySchemaBuilder[Chunk] = {
    builder
      .property("id")
      .property("title")
      .property("content")
  }

  def dynamic(builder: EntitySchemaBuilder[Chunk], entity : Chunk): EntitySchemaBuilder[Chunk] = {
    builder
      .property("id")
      .property("title")
      .property("content")
  }


}
