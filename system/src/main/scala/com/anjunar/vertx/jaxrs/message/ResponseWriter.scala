package com.anjunar.vertx.jaxrs.message

import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}
import com.anjunar.vertx.fsm.StateDef
import com.anjunar.vertx.jaxrs.MessageBodyWriter
import io.vertx.core.json.JsonObject
import io.vertx.ext.web.RoutingContext
import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.inject.Instance
import jakarta.inject.Inject
import jakarta.ws.rs.core.{MediaType, Response}
import org.hibernate.reactive.stage.Stage

import java.lang.annotation.Annotation
import java.util.concurrent.{CompletableFuture, CompletionStage}
import scala.compiletime.uninitialized

@ApplicationScoped
class ResponseWriter extends MessageBodyWriter {

  override val contentType: String = MediaType.APPLICATION_JSON
  
  @Inject
  var writers : Instance[MessageBodyWriter] = uninitialized

  override def canWrite(entity: Any, javaType: ResolvedClass, annotations: Array[Annotation], ctx: RoutingContext, state: StateDef[?], transitions: Seq[StateDef[?]]): Boolean = {
    javaType.raw == classOf[Response]
  }

  override def write(entity: Any, javaType: ResolvedClass, annotations: Array[Annotation], ctx: RoutingContext, state: StateDef[?], transitions: Seq[StateDef[?]], factory: Stage.Session): CompletionStage[String] = {
    entity match {
      case response : Response if response.hasEntity => writers.stream()
        .filter(writer => writer.canWrite(response.getEntity, TypeResolver.resolve(response.getEntity.getClass), annotations, ctx, state, transitions))
        .findFirst()
        .get()
        .write(response.getEntity, TypeResolver.resolve(response.getEntity.getClass), annotations, ctx, state, transitions, factory)
      case response : Response => CompletableFuture.completedFuture(null.asInstanceOf[String])
    }
  }
}
