package com.anjunar.vertx

import com.anjunar.vertx.annotations.Route
import com.anjunar.vertx.fsm.FSMEngine
import com.typesafe.scalalogging.Logger
import io.vertx.core.http.HttpMethod
import io.vertx.core.{AbstractVerticle, Future, Handler, Promise, VerticleBase}
import io.vertx.ext.web.handler.{BodyHandler, SessionHandler}
import io.vertx.ext.web.sstore.LocalSessionStore
import io.vertx.ext.web.{Router, RoutingContext}
import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.inject.Instance
import jakarta.enterprise.inject.spi.{Bean, BeanManager}
import jakarta.inject.Inject

import java.util
import java.util.Comparator
import scala.compiletime.uninitialized

class CDIVerticle(beanManager: BeanManager, instance: Instance[AnyRef], engine: FSMEngine) extends VerticleBase {

  val log = Logger[CDIVerticle]

  override def start(): Future[?] = {
    val router = Router.router(vertx)

    router.route().handler(BodyHandler.create())

    router.errorHandler(500, ctx => {
      val failure = ctx.failure()
      if (failure != null) log.error(failure.getMessage, failure)
      ctx.response.setStatusCode(500).end("Internal Server Error")
    })

    val sessionHandler = SessionHandler
      .create(LocalSessionStore.create(vertx))
      .setSessionCookieName("JSESSIONID")

    router.route().handler(sessionHandler);

    val beans = new util.ArrayList[Bean[?]](beanManager.getBeans(classOf[AnyRef]))

    beans.stream.filter((bean) => bean.getBeanClass.isAnnotationPresent(classOf[Route])).sorted(Comparator.comparingInt((bean) => bean.getBeanClass.getAnnotation(classOf[Route]).order)).forEach((bean) => {
      val clazz = bean.getBeanClass
      val routeAnn = clazz.getAnnotation(classOf[Route])
      val handler = instance.select(clazz).get.asInstanceOf[Handler[RoutingContext]]
      router.route(HttpMethod.valueOf(routeAnn.method), routeAnn.path)
        .order(routeAnn.order())
        .handler(handler)
    })

    val aPIEngine = instance.select(classOf[VertxAPIEngine]).get()
    aPIEngine.start(engine, router, sessionHandler)

    vertx.createHttpServer()
      .requestHandler(router)
      .listen(80)
  }
}
