package com.anjunar.technologyspeaks

import com.anjunar.technologyspeaks.control.{Role, User}
import io.vertx.core.Future
import io.vertx.ext.web.RoutingContext
import jakarta.annotation.security.RolesAllowed
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.core.Context
import jakarta.ws.rs.{GET, Path, Produces}
import org.hibernate.reactive.stage.Stage

import java.util.UUID
import java.util.concurrent.{CompletableFuture, CompletionStage}
import javax.ws.rs.core.MediaType
import scala.compiletime.uninitialized

@ApplicationScoped
@Path("/")
class ApplicationResource {

  @Inject
  var sessionFactory: Stage.SessionFactory = uninitialized

  @GET
  @Produces(Array(MediaType.APPLICATION_JSON))
  @RolesAllowed(Array("Anonymous", "Guest", "User", "Administrator"))
  def load(@Context event : RoutingContext): CompletionStage[Application] = {
    val user = event.user()

    if (user.get("username") == "Anonymous") {
      val user = new User
      user.nickName = "Anonymous"

      val application = new Application
      application.user = user
      CompletableFuture.completedFuture(application)
    } else {
      val id = user.principal().getString("id")
      sessionFactory.withSession(implicit session => {
        session.createQuery("from User u join fetch u.emails where u.id = :id", classOf[User])
          .setParameter("id", UUID.fromString(id))
          .getSingleResult
          .thenApply(user => {
            val application = new Application
            application.user = user
            application
          })
      })
    }

  }

}
