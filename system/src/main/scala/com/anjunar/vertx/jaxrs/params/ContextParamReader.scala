package com.anjunar.vertx.jaxrs.params

import com.anjunar.scala.universe.members.ResolvedMethod
import com.anjunar.vertx.fsm.StateDef
import com.anjunar.vertx.jaxrs.ParamReader
import io.vertx.core.Future
import io.vertx.ext.web.RoutingContext
import jakarta.ws.rs.core.Context

import java.lang.annotation.Annotation
import java.lang.reflect.Type

class ContextParamReader extends ParamReader {

  override def canRead(ctx: RoutingContext, javaType: Type, annotations: Array[Annotation], method: ResolvedMethod): Boolean = {
    annotations.exists(annotation => annotation.annotationType() == classOf[Context])
  }

  override def read(ctx: RoutingContext, javaType: Type, annotations: Array[Annotation], method: ResolvedMethod, state : StateDef): Future[Any] = Future.succeededFuture(ctx)
  
}
