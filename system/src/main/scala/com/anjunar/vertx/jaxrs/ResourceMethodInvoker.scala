package com.anjunar.vertx.jaxrs

import com.anjunar.vertx.fsm.StateDef
import com.typesafe.scalalogging.Logger
import io.vertx.core.Future
import io.vertx.ext.web.RoutingContext
import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.inject.Instance
import jakarta.inject.Inject

import scala.compiletime.uninitialized
import scala.jdk.CollectionConverters.*

@ApplicationScoped
class ResourceMethodInvoker {

  val log = Logger[ResourceMethodInvoker]

  @Inject
  var paramReaders: Instance[ParamReader] = uninitialized

  @Inject
  var bodyWriters: Instance[MessageBodyWriter] = uninitialized

  def invoke(ctx: RoutingContext, state: StateDef, transitions: Seq[StateDef], instance: AnyRef): Future[String] = {

    val futures = state.method.parameters.map(parameter => {
      paramReaders.stream()
        .filter(reader => reader.canRead(ctx, parameter.parameterType, parameter.annotations))
        .findFirst()
        .get()
        .read(ctx, parameter.parameterType, parameter.annotations, state)
    })

    val compositeFuture = Future.all(futures.toList.asJava)

    compositeFuture
      .transform(async => {
        val parameters = async.result().list().toArray()
        state.method.invoke(instance, parameters *)
          .asInstanceOf[Future[AnyRef]]
          .transform(async => {
            bodyWriters.stream()
              .filter(writer => writer.canWrite(async.result(), state.method.returnType.typeArguments(0), state.method.annotations, ctx, state, transitions))
              .findFirst()
              .get()
              .write(async.result(), state.method.returnType.typeArguments(0), state.method.annotations, ctx, state, transitions)
          })
      })
  }

}
