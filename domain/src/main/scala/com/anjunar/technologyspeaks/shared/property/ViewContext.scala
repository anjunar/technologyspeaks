package com.anjunar.technologyspeaks.shared.property

import com.anjunar.technologyspeaks.control.User
import com.anjunar.technologyspeaks.control.User.View
import org.hibernate.reactive.stage.Stage

import java.util.UUID
import java.util.concurrent.CompletionStage

trait ViewContext {

  def findViewByUser(user: User)(implicit session : Stage.Session): CompletionStage[View]
  
}
