package com.anjunar.vertx.jaxrs.params

import com.anjunar.scala.universe.ResolvedClass
import com.anjunar.scala.universe.members.ResolvedMethod
import com.anjunar.vertx.fsm.StateDef
import com.anjunar.vertx.jaxrs.ParamReader
import io.vertx.core.Future
import io.vertx.core.json.JsonObject
import io.vertx.ext.web.RoutingContext
import io.vertx.ext.web.handler.SessionHandler
import org.hibernate.reactive.stage.Stage

import java.lang.annotation.Annotation
import java.lang.reflect.Type
import java.util.concurrent.{CompletableFuture, CompletionStage}

class JsonObjectParamReader extends ParamReader {

  override def canRead(ctx: RoutingContext, javaType: ResolvedClass, annotations: Array[Annotation]): Boolean = {
    javaType.raw == classOf[JsonObject]
  }

  override def read(ctx: RoutingContext, sessionHandler: SessionHandler, javaType: ResolvedClass, annotations: Array[Annotation], state: StateDef, factory : Stage.SessionFactory): CompletionStage[Any] = CompletableFuture.completedFuture(ctx.body().asJsonObject())
  
}
