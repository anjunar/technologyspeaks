package com.anjunar.technologyspeaks.routes

import com.anjunar.vertx.annotations.Route
import io.vertx.core.Handler
import io.vertx.ext.web.RoutingContext
import io.vertx.ext.web.handler.StaticHandler
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
@Route(path = "/static/*")
class StaticRoute extends Handler[RoutingContext] {

  override def handle(event: RoutingContext): Unit = {

    val staticHandler = StaticHandler.create("src/main/typescript/packages/technology-speaks/dist/client")
      .setCachingEnabled(true)

    staticHandler.handle(event)

  }
}
