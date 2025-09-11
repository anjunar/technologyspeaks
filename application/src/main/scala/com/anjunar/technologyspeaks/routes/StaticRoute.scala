package com.anjunar.technologyspeaks.routes

import com.anjunar.vertx.annotations.Route
import io.vertx.core.Handler
import io.vertx.ext.web.RoutingContext
import io.vertx.ext.web.handler.StaticHandler
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
@Route(path = "/*")
class StaticRoute extends Handler[RoutingContext] {

  override def handle(event: RoutingContext): Unit = {
    
    if (event.normalizedPath() == "/") {
      event.next()
    } else {
      val staticHandler = StaticHandler.create("src/main/javascript/workspace/dist/technology-speaks/browser")
        .setCachingEnabled(true)

      staticHandler.handle(event)
    }


  }
}
