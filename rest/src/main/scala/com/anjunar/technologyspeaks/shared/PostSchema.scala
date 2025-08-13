package com.anjunar.technologyspeaks.shared

import com.anjunar.scala.schema.builder.EntitySchemaBuilder
import com.anjunar.technologyspeaks.control.{Credential, User}
import com.anjunar.technologyspeaks.shared.editor.{Editor, Root}
import com.anjunar.technologyspeaks.timeline.Post

object PostSchema {

  def static(builder: EntitySchemaBuilder[Post]): EntitySchemaBuilder[Post] = {
    builder
      .property("id")
      .property("user", property => property
        .forType(classOf[User], UserSchema.staticCompact)
      )
  }

  def dynamic(builder: EntitySchemaBuilder[Post], loaded: Post): EntitySchemaBuilder[Post] = {

    val credential = Credential.current()
    val currentUser = User.current()
    val isOwnedOrAdmin = currentUser == loaded.owner || credential.hasRole("Administrator")

    builder
      .property("id")
      .property("user", property => property
        .forType(classOf[User], builder => UserSchema.dynamicCompact(builder, loaded.user))
      )
      .property("editor", property => property
        .withWriteable(isOwnedOrAdmin)
        .forType(classOf[Editor], EditorSchema.static)
      )
  }


}
