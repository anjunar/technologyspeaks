package com.anjunar.technologyspeaks.documents

import com.anjunar.jaxrs.types.Table
import com.anjunar.technologyspeaks.document.{Document, DocumentSearch}
import io.vertx.core.Future
import io.vertx.ext.web.RoutingContext
import jakarta.annotation.security.RolesAllowed
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.{BeanParam, GET, Path}
import jakarta.ws.rs.core.Context
import org.hibernate.reactive.mutiny.Mutiny
import org.hibernate.reactive.stage.Stage

import java.util.concurrent.CompletionStage
import scala.compiletime.uninitialized

@ApplicationScoped
@Path("documents/search")
class DocumentsSearchResource  {

  @Inject
  var sessionFactory: Stage.SessionFactory = uninitialized

  @GET
  @RolesAllowed(Array("Anonymous", "Guest", "User", "Administrator"))
  def search(@Context ctx: RoutingContext, @BeanParam documentSearch: DocumentSearch): Future[DocumentSearch] = {
    Future.succeededFuture(documentSearch)
  }

}
