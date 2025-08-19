package com.anjunar.vertx.jaxrs.params

import com.anjunar.scala.introspector.DescriptionIntrospector
import com.anjunar.scala.universe.members.ResolvedMethod
import com.anjunar.vertx.fsm.StateDef
import com.anjunar.vertx.jaxrs.ParamReader
import io.vertx.core.Future
import io.vertx.ext.web.RoutingContext
import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.inject.Instance
import jakarta.inject.Inject
import jakarta.ws.rs.BeanParam

import java.lang.annotation.Annotation
import java.lang.reflect.Type
import scala.compiletime.uninitialized

import scala.jdk.CollectionConverters.*

@ApplicationScoped
class BeanParamReader extends ParamReader {

  @Inject
  var paramReaders: Instance[ParamReader] = uninitialized

  override def canRead(ctx: RoutingContext, javaType: Type, annotations: Array[Annotation], method: ResolvedMethod): Boolean = {
    annotations.exists(annotation => annotation.annotationType() == classOf[BeanParam])
  }

  override def read(ctx: RoutingContext, javaType: Type, annotations: Array[Annotation], method: ResolvedMethod, state: StateDef): Future[Any] = {

    val model = DescriptionIntrospector.createWithType(javaType)
    val instance : AnyRef = model.underlying.findConstructor().underlying.newInstance()
    val futures = model.properties.map(property => {
      paramReaders.stream()
        .filter(reader => reader.canRead(ctx, property.propertyType.underlying, property.annotations, method))
        .findFirst()
        .get()
        .read(ctx, property.propertyType.underlying, property.annotations, method, state)
        .andThen(async => {
          property.set(instance, async.result())
        })
    })

    Future.all(futures.toList.asJava)
      .transform(async => {
        Future.succeededFuture(instance)
      })
  }
}
