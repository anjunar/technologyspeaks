package com.anjunar.vertx.jaxrs.params

import com.anjunar.scala.universe.ResolvedClass
import com.anjunar.scala.universe.members.ResolvedMethod
import com.anjunar.vertx.fsm.StateDef
import com.anjunar.vertx.jaxrs.ParamReader
import io.vertx.core.Future
import io.vertx.ext.web.RoutingContext
import io.vertx.ext.web.handler.SessionHandler
import jakarta.ws.rs.core.Context
import org.jboss.weld.context.SessionContext

import java.lang.annotation.Annotation
import java.lang.reflect.Type
import java.util.concurrent.{CompletableFuture, CompletionStage}

class ContextParamReader extends ParamReader {

  override def canRead(ctx: RoutingContext, javaType: ResolvedClass, annotations: Array[Annotation]): Boolean = {
    annotations.exists(annotation => annotation.annotationType() == classOf[Context])
  }

  override def read(ctx: RoutingContext, sessionHandler: SessionHandler, javaType: ResolvedClass, annotations: Array[Annotation], state: StateDef): CompletionStage[Any] = {
    javaType.raw match {
      case clazz : Class[?] if clazz == classOf[RoutingContext] => CompletableFuture.completedFuture(ctx)
      case clazz : Class[?] if clazz == classOf[SessionHandler] => CompletableFuture.completedFuture(sessionHandler)
    }
    
  }
  
}
