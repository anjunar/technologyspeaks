package com.anjunar.vertx.jaxrs.params

import com.anjunar.scala.introspector.DescriptionIntrospector
import com.anjunar.scala.mapper.helper.Futures
import com.anjunar.scala.universe.ResolvedClass
import com.anjunar.scala.universe.members.ResolvedMethod
import com.anjunar.vertx.fsm.StateDef
import com.anjunar.vertx.jaxrs.ParamReader
import io.vertx.core.Future
import io.vertx.ext.web.RoutingContext
import io.vertx.ext.web.handler.SessionHandler
import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.inject.Instance
import jakarta.inject.Inject
import jakarta.ws.rs.BeanParam
import org.hibernate.reactive.stage.Stage

import java.lang.annotation.Annotation
import java.lang.reflect.Type
import java.util.concurrent.{CompletableFuture, CompletionStage}
import scala.compiletime.uninitialized
import scala.jdk.CollectionConverters.*
import java.util

@ApplicationScoped
class BeanParamReader extends ParamReader {

  @Inject
  var paramReaders: Instance[ParamReader] = uninitialized

  override def canRead(ctx: RoutingContext, javaType: ResolvedClass, annotations: Array[Annotation]): Boolean = {
    annotations.exists(annotation => annotation.annotationType() == classOf[BeanParam])
  }

  override def read(ctx: RoutingContext, sessionHandler: SessionHandler, javaType: ResolvedClass, annotations: Array[Annotation], state: StateDef[?], factory : Stage.Session): CompletionStage[Any] = {

    val model = DescriptionIntrospector.create(javaType)
    val instance : AnyRef = model.underlying.findConstructor().underlying.newInstance()
    val futures = model.properties.map(property => {
      paramReaders.stream()
        .filter(reader => reader.canRead(ctx, property.propertyType, property.annotations))
        .findFirst()
        .get()
        .read(ctx, sessionHandler, property.propertyType, property.annotations, state, factory)
        .thenApply {
          case collection: util.Collection[?] => 
            val underlying = property.get(instance).asInstanceOf[util.Collection[Any]]
            underlying.addAll(collection)
            underlying
          case async => 
            property.set(instance, async)
            async
        }
        .toCompletableFuture
    })

    Futures.combineAll(futures.toList)
      .thenApply(_ => instance)
  }
}
