package com.anjunar.vertx.jaxrs.params

import com.anjunar.scala.mapper.IdProvider
import com.anjunar.scala.universe.ResolvedClass
import com.anjunar.scala.universe.members.ResolvedMethod
import com.anjunar.vertx.fsm.StateDef
import com.anjunar.vertx.jaxrs.ParamReader
import io.vertx.core.Future
import io.vertx.ext.web.RoutingContext
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.PathParam
import org.hibernate.reactive.stage.Stage

import java.lang.annotation.Annotation
import java.lang.reflect.Type
import java.util.UUID
import scala.compiletime.uninitialized

@ApplicationScoped
class PathParamReader extends ParamReader {

  @Inject
  var sessionFactory : Stage.SessionFactory = uninitialized

  override def canRead(ctx: RoutingContext, javaType: ResolvedClass, annotations: Array[Annotation]): Boolean = {
    annotations.exists(annotation => annotation.annotationType() == classOf[PathParam])
  }

  override def read(ctx: RoutingContext, javaType: ResolvedClass, annotations: Array[Annotation], state: StateDef): Future[Any] = {
    val value = ctx.pathParam(annotations.find(annotation => annotation.annotationType() == classOf[PathParam]).get.asInstanceOf[PathParam].value())

    javaType.raw match {
      case clazz : Class[Any] if classOf[IdProvider].isAssignableFrom(clazz) =>
        Future.fromCompletionStage(sessionFactory.withTransaction(session => {
          session.find(clazz, UUID.fromString(value))
        }))
    }
  }
}
