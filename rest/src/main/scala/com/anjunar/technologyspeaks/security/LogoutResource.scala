package com.anjunar.technologyspeaks.security

import io.vertx.ext.web.RoutingContext
import jakarta.annotation.security.RolesAllowed
import jakarta.enterprise.context.ApplicationScoped
import jakarta.ws.rs.core.{Context, Response}
import jakarta.ws.rs.{GET, POST, Path}

import java.util.concurrent.{CompletableFuture, CompletionStage}

@ApplicationScoped
@Path("security/logout")
class LogoutResource {

  @POST
  @RolesAllowed(Array("Guest", "User", "Administrator"))
  def logout(@Context routingContext: RoutingContext): CompletionStage[Response] = {
    routingContext.userContext().logout()
      .map(_ => {
        Response.ok().build()    
      })
      .toCompletionStage
  }


}
