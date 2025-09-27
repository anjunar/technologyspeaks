package com.anjunar.vertx.jaxrs

import com.anjunar.scala.mapper.helper.Futures
import com.anjunar.vertx.fsm.StateDef
import com.typesafe.scalalogging.Logger
import io.vertx.core.Future
import io.vertx.ext.web.RoutingContext
import io.vertx.ext.web.handler.SessionHandler
import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.inject.Instance
import jakarta.inject.Inject
import org.hibernate.reactive.stage.Stage

import java.util.concurrent.{CompletableFuture, CompletionStage}
import scala.compiletime.uninitialized
import scala.jdk.CollectionConverters.*

@ApplicationScoped
class ResourceMethodInvoker {

  val log = Logger[ResourceMethodInvoker]

  @Inject
  var paramReaders: Instance[ParamReader] = uninitialized

  @Inject
  var bodyWriters: Instance[MessageBodyWriter] = uninitialized
  
  @Inject
  var sessionFactory : Stage.SessionFactory = uninitialized

  def invoke(ctx: RoutingContext, sessionHandler: SessionHandler, state: StateDef, transitions: Seq[StateDef], instance: AnyRef): CompletionStage[(String, String)] = {
    sessionFactory.openSession.thenCompose(session => {
      log.debug("Resource Method invoker begin, Session begin " + state)

      val futures = state.method.parameters
        .map(parameter => {
          val paramReader = paramReaders.stream()
            .filter(reader => reader.canRead(ctx, parameter.parameterType, parameter.annotations))
            .findFirst()
            .get()

          paramReader
            .read(ctx, sessionHandler, parameter.parameterType, parameter.annotations, state, session)
            .toCompletableFuture
        })

      val compositeFuture =
        if (futures.isEmpty) CompletableFuture.completedFuture[Void](null)
        else Futures.combineAll(futures.toList)

      compositeFuture
        .thenCompose(async => {
          val parameters = futures.map(future => future.join())
          state.method.invoke(instance, parameters *)
            .asInstanceOf[CompletableFuture[AnyRef]]
            .thenCompose(async => {
              val bodyWriter = bodyWriters.stream()
                .filter(writer => writer.canWrite(async, state.method.returnType.typeArguments(0), state.method.annotations, ctx, state, transitions))
                .findFirst()
                .get()

              bodyWriter.write(async, state.method.returnType.typeArguments(0), state.method.annotations, ctx, state, transitions, session)
                .thenApply(body => (bodyWriter.contentType, body))
                .whenComplete((_,_) => {
                  session.close()
                  log.debug("Resource Method invoker Session Close " + state)
                })
            })
        })
    })
  }

}
