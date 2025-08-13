package com.anjunar.technologyspeaks.documents

import com.anjunar.vertx.annotations.Route
import io.vertx.core.Handler
import io.vertx.ext.web.RoutingContext
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
@Route(path = "/service/documents/search")
class DocumentsRoute extends Handler[RoutingContext] {

  override def handle(event: RoutingContext): Unit = {
    event.response().end("""{"$type" : "DocumentSearch"}""", "UTF-8")
  }
}
