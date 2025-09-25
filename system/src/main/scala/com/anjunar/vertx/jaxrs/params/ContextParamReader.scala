package com.anjunar.vertx.jaxrs.params

import com.anjunar.scala.universe.ResolvedClass
import com.anjunar.vertx.fsm.StateDef
import com.anjunar.vertx.jaxrs.ParamReader
import com.anjunar.vertx.jaxrs.providers.ContextProvider
import io.vertx.ext.web.RoutingContext
import io.vertx.ext.web.handler.SessionHandler
import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.inject.Instance
import jakarta.inject.Inject
import jakarta.ws.rs.core.Context
import org.hibernate.reactive.stage.Stage

import java.lang.annotation.Annotation
import java.util.concurrent.{CompletableFuture, CompletionStage}
import scala.compiletime.uninitialized

@ApplicationScoped
class ContextParamReader extends ParamReader {

  @Inject
  var contextProviders : Instance[ContextProvider] = uninitialized

  override def canRead(ctx: RoutingContext, javaType: ResolvedClass, annotations: Array[Annotation]): Boolean = {
    annotations.exists(annotation => annotation.annotationType() == classOf[Context])
  }

  override def read(ctx: RoutingContext, sessionHandler: SessionHandler, javaType: ResolvedClass, annotations: Array[Annotation], state: StateDef, factory: Stage.Session): CompletionStage[Any] = {
    javaType.raw match {
      case clazz: Class[?] if clazz == classOf[RoutingContext] => CompletableFuture.completedFuture(ctx)
      case clazz: Class[?] if clazz == classOf[SessionHandler] => CompletableFuture.completedFuture(sessionHandler)
      case clazz: Class[?] if clazz == classOf[Stage.Session] => CompletableFuture.completedFuture(factory)
      case _ => CompletableFuture.completedFuture(contextProviders
        .stream()
        .filter(provider => provider.canRead(javaType, annotations))
        .findFirst()
        .get()
        .read(javaType, annotations, ctx))
    }

  }

}
