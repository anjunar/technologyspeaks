package com.anjunar.technologyspeaks

import com.anjunar.vertx.annotations.Route
import io.vertx.core.Handler
import io.vertx.ext.web.RoutingContext
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
@Route(path = "/service")
class ApplicationRoute extends Handler[RoutingContext] {

  override def handle(event: RoutingContext): Unit = {

    event.response().end("""{"$type" : "Application"}""", "UTF-8")

  }
}
