package com.anjunar.technologyspeaks.shared

import com.anjunar.scala.schema.builder.EntitySchemaBuilder
import com.anjunar.technologyspeaks.control.{Credential, User}
import com.anjunar.technologyspeaks.document.Document
import com.anjunar.technologyspeaks.shared.editor.{Editor, Root}
import com.anjunar.technologyspeaks.shared.hashtag.HashTag

object DocumentSchema {

  def staticCompact(builder: EntitySchemaBuilder[Document]): EntitySchemaBuilder[Document] = {
    builder
      .property("id")
      .property("title")
  }

  def static(builder: EntitySchemaBuilder[Document]): EntitySchemaBuilder[Document] = {
    builder
      .property("id")
      .property("title")
      .property("description")
      .property("created")
      .property("modified")
      .property("language")
      .property("user", property => property
        .forType(classOf[User], UserSchema.staticCompact)
      )
      .property("hashTags", property => property
        .forType(classOf[HashTag], HashTagSchema.static)
      )
  }

  def dynamic(builder: EntitySchemaBuilder[Document], loaded: Document): EntitySchemaBuilder[Document] = {

    val credential = Credential.current()
    val currentUser = User.current()
    val isOwnedOrAdmin = currentUser == loaded.owner || credential.hasRole("Administrator")

    builder
      .property("id")
      .property("title", property => property
        .withTitle("Title")
        .withWriteable(true)
      )
      .property("description")
      .property("created")
      .property("modified")
      .property("language")
      .property("user", property => property
        .forType(classOf[User], builder => UserSchema.dynamicCompact(builder, loaded.user))
      )
      .property("editor", property => property
        .withWriteable(isOwnedOrAdmin)
        .forType(classOf[Editor], EditorSchema.static)
      )
      .property("hashTags", property => property
        .forType(classOf[HashTag], HashTagSchema.static)
      )
  }

}
