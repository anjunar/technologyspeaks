package com.anjunar.vertx.jaxrs.params

import com.anjunar.jaxrs.search.jpa.JPAUtil
import com.anjunar.scala.mapper.IdProvider
import com.anjunar.scala.universe.ResolvedClass
import com.anjunar.scala.universe.members.ResolvedMethod
import com.anjunar.vertx.fsm.StateDef
import com.anjunar.vertx.jaxrs.ParamReader
import io.vertx.core.Future
import io.vertx.ext.web.RoutingContext
import io.vertx.ext.web.handler.SessionHandler
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.PathParam
import org.hibernate.reactive.stage.Stage

import java.lang.annotation.Annotation
import java.lang.reflect.Type
import java.util.UUID
import java.util.concurrent.{CompletableFuture, CompletionStage}
import scala.compiletime.uninitialized

@ApplicationScoped
class PathParamReader extends ParamReader {

  override def canRead(ctx: RoutingContext, javaType: ResolvedClass, annotations: Array[Annotation]): Boolean = {
    annotations.exists(annotation => annotation.annotationType() == classOf[PathParam])
  }

  override def read(ctx: RoutingContext, sessionHandler: SessionHandler, javaType: ResolvedClass, annotations: Array[Annotation], state: StateDef, factory : Stage.Session): CompletionStage[Any] = {
    val value = ctx.pathParam(annotations.find(annotation => annotation.annotationType() == classOf[PathParam]).get.asInstanceOf[PathParam].value())

    javaType.raw match {
      case clazz : Class[AnyRef] if classOf[IdProvider].isAssignableFrom(clazz) =>
        factory.find(clazz, UUID.fromString(value))
          .thenCompose(entity => {
            JPAUtil.fetchEntityRecursively(entity, clazz, factory)
              .thenApply(_ => {
                entity.asInstanceOf[Any]
              })
          })
    }
  }
}
