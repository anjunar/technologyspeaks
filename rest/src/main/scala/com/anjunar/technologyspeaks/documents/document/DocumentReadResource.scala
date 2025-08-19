package com.anjunar.technologyspeaks.documents.document

import com.anjunar.technologyspeaks.document.Document
import io.vertx.core.Future
import jakarta.annotation.security.RolesAllowed
import jakarta.enterprise.context.ApplicationScoped
import jakarta.ws.rs.core.{MediaType, Response}
import jakarta.ws.rs.{GET, Path, PathParam, Produces}

@ApplicationScoped
@Path("documents/document/:id")
class DocumentReadResource {
  
  @GET
  @Produces(Array(MediaType.APPLICATION_JSON))
  @RolesAllowed(Array("Anonymous", "Guest", "User", "Administrator"))
  def read(@PathParam("id") entity : Document) : Future[Document] = {
    Future.succeededFuture(entity)
  }

}
