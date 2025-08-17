package com.anjunar.technologyspeaks

import com.anjunar.technologyspeaks.control.User
import com.anjunar.vertx.fsm.services.DefaultFSMService
import io.vertx.core.Future
import io.vertx.ext.web.RoutingContext
import jakarta.enterprise.context.ApplicationScoped

import java.util.UUID

@ApplicationScoped
class ApplicationService extends DefaultFSMService[Application] {
  
  def run(event : RoutingContext): Future[Application] = {

    val user = event.user()

    if (user == null) {
      val user = new User
      user.nickName = "Guest"

      val application = new Application
      application.user = user
      Future.succeededFuture(application)
    } else {
      val id = user.principal().getString("id")
      Future.fromCompletionStage(User.find(UUID.fromString(id))
        .thenApply(user => {
          val application = new Application
          application.user = user
          application
        }))
    }
  }

}
