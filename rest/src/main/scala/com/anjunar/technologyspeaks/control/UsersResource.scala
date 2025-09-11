package com.anjunar.technologyspeaks.control

import com.anjunar.jaxrs.search.jpa.JPASearch
import com.anjunar.jaxrs.types.Table
import io.vertx.ext.web.RoutingContext
import jakarta.annotation.security.RolesAllowed
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.core.{Context, MediaType}
import jakarta.ws.rs.{BeanParam, GET, Path, Produces}
import org.hibernate.reactive.stage.Stage

import java.util.concurrent.{CompletableFuture, CompletionStage}
import scala.compiletime.uninitialized

object UsersResource {

  @ApplicationScoped
  @Path("control/users/search")
  class Search {

    @Inject
    var sessionFactory: Stage.SessionFactory = uninitialized

    @GET
    @RolesAllowed(Array("User", "Administrator"))
    def search(@Context ctx: RoutingContext, @BeanParam search: UserSearch): CompletableFuture[UserSearch] = {
      CompletableFuture.completedFuture(search)
    }

  }

  @ApplicationScoped
  @Path("control/users")
  class List {

    @Inject
    var sessionSearch: JPASearch = uninitialized

    @GET
    @Produces(Array(MediaType.APPLICATION_JSON))
    @RolesAllowed(Array("User", "Administrator"))
    def list(@Context ctx: RoutingContext,
             @BeanParam search: UserSearch): CompletionStage[Table[User]] = {
      sessionSearch.run(search, classOf[User])
    }

  }
}