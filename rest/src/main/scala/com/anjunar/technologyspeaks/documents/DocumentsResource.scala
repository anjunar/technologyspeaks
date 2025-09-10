package com.anjunar.technologyspeaks.documents

import com.anjunar.jaxrs.search.jpa.JPASearch
import com.anjunar.jaxrs.types.Table
import com.anjunar.technologyspeaks.document.{Document, DocumentSearch}
import io.vertx.ext.web.RoutingContext
import jakarta.annotation.security.RolesAllowed
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.core.{Context, MediaType}
import jakarta.ws.rs.{BeanParam, GET, Path, Produces}
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

    @Inject
    var sessionFactory: Stage.SessionFactory = uninitialized

    @Inject
    var sessionSearch: JPASearch = uninitialized

    @GET
    @Produces(Array(MediaType.APPLICATION_JSON))
    @RolesAllowed(Array("Anonymous", "Guest", "User", "Administrator"))
    def list(@Context ctx: RoutingContext,
             @BeanParam search: DocumentSearch): CompletionStage[Table[Document]] = {
      val searchContext = sessionSearch.searchContext(search)

      val entities = sessionFactory
        .withSession(implicit session => {
          sessionSearch.entities(search.index, search.limit, classOf[Document], searchContext)
        })
        .toCompletableFuture

      val count = sessionFactory
        .withSession(implicit session => {
          sessionSearch.count(classOf[Document], searchContext)
        })
        .toCompletableFuture

      CompletableFuture.allOf(entities, count)
        .thenApply(_ => {
          new Table(entities.join().stream().map(tuple => tuple.get(0, classOf[Document])).toList, count.join())
        })
    }

  }


}