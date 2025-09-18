package com.anjunar.technologyspeaks.control

import com.anjunar.jpa.EntityGraph
import io.vertx.ext.web.RoutingContext
import jakarta.annotation.security.RolesAllowed
import jakarta.enterprise.context.ApplicationScoped
import jakarta.ws.rs.core.{Context, MediaType, Response}
import jakarta.ws.rs.{Consumes, DELETE, GET, POST, PUT, Path, PathParam, Produces}

import java.util.concurrent.CompletableFuture

object UserResource {

  @ApplicationScoped
  @Path("control/users/user")
  class Create {

    @GET
    @Produces(Array(MediaType.APPLICATION_JSON))
    @RolesAllowed(Array("User", "Administrator"))
    def create(): CompletableFuture[User] = {
      CompletableFuture.completedFuture(new User)
    }

  }

  @ApplicationScoped
  @Path("control/users/user/:id")
  class Read {

    @GET
    @Produces(Array(MediaType.APPLICATION_JSON))
    @RolesAllowed(Array("Guest", "User", "Administrator"))
    def read(@PathParam("id") entity: User): CompletableFuture[User] = {
      CompletableFuture.completedFuture(entity)
    }

  }

  @ApplicationScoped
  @Path("control/users/user")
  class Save {

    @POST
    @Consumes(Array(MediaType.APPLICATION_JSON))
    @Produces(Array(MediaType.APPLICATION_JSON))
    @RolesAllowed(Array("User", "Administrator"))
    def save(entity: User): CompletableFuture[User] = {
      CompletableFuture.completedFuture(entity)
    }

  }

  @ApplicationScoped
  @Path("control/users/user")
  class Update {

    @PUT
    @Consumes(Array(MediaType.APPLICATION_JSON))
    @Produces(Array(MediaType.APPLICATION_JSON))
    @RolesAllowed(Array("User", "Administrator"))
    def update(entity: User): CompletableFuture[User] = {
      CompletableFuture.completedFuture(entity)
    }

  }

  @ApplicationScoped
  @Path("control/users/user/:id")
  class Delete {

    @DELETE
    @Produces(Array(MediaType.APPLICATION_JSON))
    @RolesAllowed(Array("User", "Administrator"))
    def delete(@PathParam("id") entity: User): CompletableFuture[Response] = {
      CompletableFuture.completedFuture(Response.ok().build())
    }

  }

}
