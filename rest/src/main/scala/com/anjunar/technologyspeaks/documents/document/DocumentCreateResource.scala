package com.anjunar.technologyspeaks.documents.document

import com.anjunar.technologyspeaks.document.Document
import io.vertx.core.Future
import jakarta.annotation.security.RolesAllowed
import jakarta.enterprise.context.ApplicationScoped
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.{GET, Path, Produces}

import java.util.concurrent.CompletableFuture

@ApplicationScoped
@Path("documents/document")
class DocumentCreateResource {
  
  @GET
  @Produces(Array(MediaType.APPLICATION_JSON))
  @RolesAllowed(Array("User", "Administrator"))
  def create() : CompletableFuture[Document] = {
    CompletableFuture.completedFuture(new Document)
  }

}
