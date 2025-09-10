package com.anjunar.technologyspeaks.documents

import com.anjunar.technologyspeaks.document.Document
import jakarta.annotation.security.RolesAllowed
import jakarta.enterprise.context.ApplicationScoped
import jakarta.ws.rs.core.{MediaType, Response}
import jakarta.ws.rs.*

import java.util.concurrent.CompletableFuture

object DocumentResource {

  @ApplicationScoped
  @Path("documents/document")
  class Create {

    @GET
    @Produces(Array(MediaType.APPLICATION_JSON))
    @RolesAllowed(Array("User", "Administrator"))
    def create(): CompletableFuture[Document] = {
      CompletableFuture.completedFuture(new Document)
    }

  }

  @ApplicationScoped
  @Path("documents/document/:id")
  class Read  {

    @GET
    @Produces(Array(MediaType.APPLICATION_JSON))
    @RolesAllowed(Array("Anonymous", "Guest", "User", "Administrator"))
    def read(@PathParam("id") entity: Document): CompletableFuture[Document] = {
      CompletableFuture.completedFuture(entity)
    }

  }

  @ApplicationScoped
  @Path("documents/document")
  class Save {

    @POST
    @Consumes(Array(MediaType.APPLICATION_JSON))
    @Produces(Array(MediaType.APPLICATION_JSON))
    @RolesAllowed(Array("User", "Administrator"))
    def save(entity: Document): CompletableFuture[Document] = {
      CompletableFuture.completedFuture(entity)
    }

  }

  @ApplicationScoped
  @Path("documents/document")
  class Update {

    @PUT
    @Consumes(Array(MediaType.APPLICATION_JSON))
    @Produces(Array(MediaType.APPLICATION_JSON))
    @RolesAllowed(Array("User", "Administrator"))
    def update(entity: Document): CompletableFuture[Document] = {
      CompletableFuture.completedFuture(entity)
    }

  }

  @ApplicationScoped
  @Path("documents/document/:id")
  class Delete {

    @DELETE
    @Produces(Array(MediaType.APPLICATION_JSON))
    @RolesAllowed(Array("User", "Administrator"))
    def delete(@PathParam("id") entity: Document): CompletableFuture[Response] = {
      CompletableFuture.completedFuture(Response.ok().build())
    }

  }

}
