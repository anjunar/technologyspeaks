package com.anjunar.vertx.jaxrs.message

import com.anjunar.scala.universe.TypeResolver
import com.anjunar.scala.universe.members.ResolvedMethod
import com.anjunar.vertx.fsm.StateDef
import com.anjunar.vertx.jaxrs.MessageBodyWriter
import io.vertx.core.Future
import io.vertx.core.json.JsonObject
import io.vertx.ext.web.RoutingContext
import jakarta.enterprise.context.ApplicationScoped
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType

import java.lang.annotation.Annotation
import java.lang.reflect.Type

@ApplicationScoped
@Produces(Array(MediaType.APPLICATION_JSON))
class JsonObjectWriter extends MessageBodyWriter {

  override def canWrite(entity: Any, javaType: Type, annotations: Array[Annotation], ctx: RoutingContext, state: StateDef, transitions: Seq[StateDef]): Boolean = {
    TypeResolver.resolve(javaType).typeArguments(0).raw == classOf[JsonObject]
  }

  override def write(entity: Any, javaType: Type, annotations: Array[Annotation], ctx : RoutingContext, state : StateDef, transitions : Seq[StateDef]): Future[String] = {
    Future.succeededFuture(entity.asInstanceOf[JsonObject].encode())
  }
  
}
