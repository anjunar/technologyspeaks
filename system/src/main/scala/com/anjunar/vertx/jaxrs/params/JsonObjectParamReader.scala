package com.anjunar.vertx.jaxrs.params

import com.anjunar.scala.universe.members.ResolvedMethod
import com.anjunar.vertx.fsm.StateDef
import com.anjunar.vertx.jaxrs.ParamReader
import io.vertx.core.Future
import io.vertx.core.json.JsonObject
import io.vertx.ext.web.RoutingContext

import java.lang.annotation.Annotation
import java.lang.reflect.Type

class JsonObjectParamReader extends ParamReader {

  override def canRead(ctx: RoutingContext, javaType: Type, annotations: Array[Annotation], method: ResolvedMethod): Boolean = {
    javaType == classOf[JsonObject] 
  }

  override def read(ctx: RoutingContext, javaType: Type, annotations: Array[Annotation], method: ResolvedMethod, state : StateDef): Future[Any] = Future.succeededFuture(ctx.body().asJsonObject())
  
}
