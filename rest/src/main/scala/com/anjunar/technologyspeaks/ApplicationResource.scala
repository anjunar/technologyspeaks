package com.anjunar.technologyspeaks

import com.anjunar.technologyspeaks.control.User
import io.vertx.core.Future
import io.vertx.ext.web.RoutingContext
import jakarta.annotation.security.RolesAllowed
import jakarta.enterprise.context.ApplicationScoped
import jakarta.ws.rs.core.Context
import jakarta.ws.rs.{GET, Path, Produces}

import java.util.UUID
import javax.ws.rs.core.MediaType

@ApplicationScoped
@Path("/")
class ApplicationResource {
  
  @GET
  @Produces(Array(MediaType.APPLICATION_JSON))
  @RolesAllowed(Array("Anonymous", "Guest", "User", "Administrator"))
  def load(@Context event : RoutingContext): Future[Application] = {

    val user = event.user()

    if (user.get("username") == "Anonymous") {
      val user = new User
      user.nickName = "Anonymous"

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
