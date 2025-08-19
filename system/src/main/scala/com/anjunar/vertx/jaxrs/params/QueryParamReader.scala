package com.anjunar.vertx.jaxrs.params

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
import jakarta.ws.rs.QueryParam
import org.hibernate.reactive.stage.Stage

import java.lang.annotation.Annotation
import java.lang.reflect.Type
import java.util.UUID
import java.util.concurrent.CompletableFuture
import scala.compiletime.uninitialized

@ApplicationScoped
class QueryParamReader extends ParamReader {

  @Inject
  var sessionFactory: Stage.SessionFactory = uninitialized

  override def canRead(ctx: RoutingContext, javaType: ResolvedClass, annotations: Array[Annotation]): Boolean = {
    annotations.exists(annotation => annotation.annotationType() == classOf[QueryParam])
  }

  override def read(ctx: RoutingContext, sessionHandler: SessionHandler, javaType: ResolvedClass, annotations: Array[Annotation], state: StateDef): CompletableFuture[Any] = {
    val value = ctx.queryParam(annotations.find(annotation => annotation.annotationType() == classOf[QueryParam]).get.asInstanceOf[QueryParam].value())

    if (value.isEmpty) {
      CompletableFuture.completedFuture(null)
    } else {
      javaType.raw match {
        case clazz: Class[Any] if classOf[IdProvider].isAssignableFrom(clazz) =>
          sessionFactory.withTransaction(session => {
            session.find(clazz, UUID.fromString(value.getFirst))
          }).toCompletableFuture
        case clazz: Class[Any] if classOf[String].isAssignableFrom(clazz) =>
          CompletableFuture.completedFuture(value.getFirst)
      }
    }


  }
}
