package com.anjunar.vertx

import com.anjunar.vertx.annotations.Route
import io.vertx.core.http.HttpMethod
import io.vertx.core.{AbstractVerticle, Handler, Promise}
import io.vertx.ext.web.handler.SessionHandler
import io.vertx.ext.web.sstore.LocalSessionStore
import io.vertx.ext.web.{Router, RoutingContext}
import jakarta.enterprise.inject.se.SeContainer
import jakarta.enterprise.inject.spi.{Bean, CDI}

import java.util
import java.util.Comparator

class CDIApiVerticle(val container: CDI[AnyRef]) extends AbstractVerticle {

  override def start(startPromise: Promise[Void]): Unit = {
    val router = Router.router(vertx)

    val sessionHandler = SessionHandler
      .create(LocalSessionStore.create(vertx))
      .setSessionCookieName("JSESSIONID")
    router.route().handler(sessionHandler);

    val beans = new util.ArrayList[Bean[?]](container.getBeanManager.getBeans(classOf[AnyRef]))

    beans.stream.filter((bean) => bean.getBeanClass.isAnnotationPresent(classOf[Route])).sorted(Comparator.comparingInt((bean) => bean.getBeanClass.getAnnotation(classOf[Route]).order)).forEach((bean) => {
      val clazz = bean.getBeanClass
      val routeAnn = clazz.getAnnotation(classOf[Route])
      val handler = container.select(clazz).get.asInstanceOf[Handler[RoutingContext]]
      router.route(HttpMethod.valueOf(routeAnn.method), routeAnn.path).handler(handler)
    })

    vertx.createHttpServer()
      .requestHandler(router)
      .listen(8080)

  }
}
