package com.anjunar.vertx.jaxrs.message

import com.anjunar.scala.universe.ResolvedClass
import com.anjunar.vertx.fsm.StateDef
import com.anjunar.vertx.jaxrs.MessageBodyWriter
import io.vertx.core.Future
import io.vertx.core.json.JsonObject
import io.vertx.ext.web.RoutingContext
import jakarta.enterprise.context.ApplicationScoped
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType

import java.lang.annotation.Annotation
import java.util.concurrent.CompletableFuture

@ApplicationScoped
@Produces(Array(MediaType.APPLICATION_JSON))
class JsonObjectWriter extends MessageBodyWriter {

  override def canWrite(entity: Any, javaType: ResolvedClass, annotations: Array[Annotation], ctx: RoutingContext, state: StateDef, transitions: Seq[StateDef]): Boolean = {
    javaType.raw == classOf[JsonObject]
  }

  override def write(entity: Any, javaType: ResolvedClass, annotations: Array[Annotation], ctx: RoutingContext, state: StateDef, transitions: Seq[StateDef]): CompletableFuture[String] = {
    CompletableFuture.completedFuture(entity.asInstanceOf[JsonObject].encode())
  }

}
