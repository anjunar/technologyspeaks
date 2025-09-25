package com.anjunar.technologyspeaks.security

import com.anjunar.technologyspeaks.shared.property.ManagedProperty
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.{GET, Path, PathParam, Produces}
import org.hibernate.reactive.stage.Stage

import java.util.concurrent.{CompletableFuture, CompletionStage}
import scala.compiletime.uninitialized

@ApplicationScoped
@Path("security/property")
class ManagedPropertyResource {

  @Inject
  var factory : Stage.SessionFactory = uninitialized
  
  @GET
  @Produces()
  @Path(":id")  
  def read(@PathParam("id") property : ManagedProperty): CompletionStage[ManagedProperty] = {
    CompletableFuture.completedFuture(property)
  }

}
