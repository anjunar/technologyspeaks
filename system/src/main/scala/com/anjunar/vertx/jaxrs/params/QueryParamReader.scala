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
import jakarta.ws.rs.{DefaultValue, QueryParam}
import org.hibernate.reactive.stage.Stage

import java.lang.annotation.Annotation
import java.lang.reflect.Type
import java.util.{Collections, UUID}
import java.util.concurrent.{CompletableFuture, CompletionStage}
import scala.compiletime.uninitialized
import java.util

@ApplicationScoped
class QueryParamReader extends ParamReader {

  @Inject
  var sessionFactory: Stage.SessionFactory = uninitialized

  override def canRead(ctx: RoutingContext, javaType: ResolvedClass, annotations: Array[Annotation]): Boolean = {
    annotations.exists(annotation => annotation.annotationType() == classOf[QueryParam])
  }

  override def read(ctx: RoutingContext, sessionHandler: SessionHandler, javaType: ResolvedClass, annotations: Array[Annotation], state: StateDef, factory : Stage.SessionFactory): CompletionStage[Any] = {
    val value = ctx.queryParam(annotations.find(annotation => annotation.annotationType() == classOf[QueryParam]).get.asInstanceOf[QueryParam].value())

    if (value.isEmpty) {
      javaType.raw match {
        case clazz: Class[?] if classOf[util.List[?]].isAssignableFrom(clazz) => CompletableFuture.completedFuture(new util.ArrayList[Any]())
        case clazz: Class[?] if classOf[util.Set[?]].isAssignableFrom(clazz) => CompletableFuture.completedFuture(new util.HashSet[Any]())
        case _ =>
          val option = annotations.find(annotation => annotation.annotationType() == classOf[DefaultValue])
          if (option.isDefined) {
            buildValue(javaType, option.get.asInstanceOf[DefaultValue].value())
          } else {
            CompletableFuture.completedFuture(null)
          }
      }
    } else {
      val first = value.getFirst
      buildValue(javaType, first)
    }
  }

  private def buildValue(javaType: ResolvedClass, first: String) = {
    javaType.raw match {
      case clazz: Class[Any] if classOf[IdProvider].isAssignableFrom(clazz) =>
        sessionFactory.withSession(session => {
          session.find(clazz, UUID.fromString(first))
        }).toCompletableFuture
      case clazz: Class[Any] if classOf[String].isAssignableFrom(clazz) =>
        CompletableFuture.completedFuture(first)
      case clazz: Class[Any] if classOf[Integer].isAssignableFrom(clazz) =>
        CompletableFuture.completedFuture(first.toInt)
      case clazz: Class[Any] if classOf[Long].isAssignableFrom(clazz) =>
        CompletableFuture.completedFuture(first.toLong)
    }
  }
}
