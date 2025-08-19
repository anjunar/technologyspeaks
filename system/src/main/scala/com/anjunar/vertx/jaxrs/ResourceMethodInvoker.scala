package com.anjunar.vertx.jaxrs

import com.anjunar.vertx.fsm.StateDef
import com.typesafe.scalalogging.Logger
import io.vertx.core.Future
import io.vertx.ext.web.RoutingContext
import io.vertx.ext.web.handler.SessionHandler
import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.inject.Instance
import jakarta.inject.Inject

import java.util.concurrent.CompletableFuture
import scala.compiletime.uninitialized
import scala.jdk.CollectionConverters.*

@ApplicationScoped
class ResourceMethodInvoker {

  val log = Logger[ResourceMethodInvoker]

  @Inject
  var paramReaders: Instance[ParamReader] = uninitialized

  @Inject
  var bodyWriters: Instance[MessageBodyWriter] = uninitialized

  def invoke(ctx: RoutingContext, sessionHandler: SessionHandler, state: StateDef, transitions: Seq[StateDef], instance: AnyRef): CompletableFuture[(String, String)] = {

    val futures = state.method.parameters.map(parameter => {
      paramReaders.stream()
        .filter(reader => reader.canRead(ctx, parameter.parameterType, parameter.annotations))
        .findFirst()
        .get()
        .read(ctx, sessionHandler, parameter.parameterType, parameter.annotations, state)
    })

    val compositeFuture = CompletableFuture.allOf(futures*)

    compositeFuture
      .thenCompose(async => {
        val parameters = futures.map(future => future.get())
        state.method.invoke(instance, parameters*)
          .asInstanceOf[CompletableFuture[AnyRef]]
          .thenCompose(async => {
            val bodyWriter = bodyWriters.stream()
              .filter(writer => writer.canWrite(async, state.method.returnType.typeArguments(0), state.method.annotations, ctx, state, transitions))
              .findFirst()
              .get()
              
            bodyWriter.write(async, state.method.returnType.typeArguments(0), state.method.annotations, ctx, state, transitions)
              .thenApply(body => (bodyWriter.contentType, body))
          })
      })
  }

}
