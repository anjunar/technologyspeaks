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

object DocumentsResource {

  @ApplicationScoped
  @Path("documents/search")
  class Search {

    @Inject
    var sessionFactory: Stage.SessionFactory = uninitialized

    @GET
    @RolesAllowed(Array("Anonymous", "Guest", "User", "Administrator"))
    def search(@Context ctx: RoutingContext, @BeanParam documentSearch: DocumentSearch): CompletableFuture[DocumentSearch] = {
      CompletableFuture.completedFuture(documentSearch)
    }

  }

  @ApplicationScoped
  @Path("documents")
  class List {

    @GET
    @Produces(Array(MediaType.APPLICATION_JSON))
    @RolesAllowed(Array("Anonymous", "Guest", "User", "Administrator"))
    def list(@Context ctx: RoutingContext,
             @Context session: Stage.Session,
             @BeanParam search: DocumentSearch): CompletionStage[Table[Document]] = {
      session
        .createQuery("from Document", classOf[Document])
        .getResultList
        .thenApply(documents => new Table[Document](documents, documents.size()))
    }

  }


}