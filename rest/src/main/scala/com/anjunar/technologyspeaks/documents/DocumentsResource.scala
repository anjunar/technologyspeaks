package com.anjunar.technologyspeaks.documents

import com.anjunar.jaxrs.types.Table
import com.anjunar.technologyspeaks.document.{Document, DocumentSearch}
import io.vertx.core.Future
import io.vertx.ext.web.RoutingContext
import jakarta.annotation.security.RolesAllowed
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.core.{Context, MediaType}
import jakarta.ws.rs.{BeanParam, GET, Path, Produces}
import org.hibernate.reactive.mutiny.Mutiny
import org.hibernate.reactive.stage.Stage

import java.util.concurrent.{CompletableFuture, CompletionStage}
import scala.compiletime.uninitialized

@ApplicationScoped
@Path("documents")
class DocumentsResource {

  @Inject
  var sessionFactory: Stage.SessionFactory = uninitialized

  @GET
  @Produces(Array(MediaType.APPLICATION_JSON))
  @RolesAllowed(Array("Anonymous", "Guest", "User", "Administrator"))  
  def list(@Context ctx: RoutingContext, @BeanParam search : DocumentSearch): CompletableFuture[Table[Document]] = {
    sessionFactory
      .withTransaction((session, tx) => {
        session
          .createQuery("from Document", classOf[Document])
          .getResultList
          .thenApply(documents => new Table[Document](documents, documents.size()))
      })
      .toCompletableFuture
  }
  
}
