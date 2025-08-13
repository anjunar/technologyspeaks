package com.anjunar.technologyspeaks.routes

import com.anjunar.vertx.annotations.Route
import io.vertx.core.Handler
import io.vertx.core.json.JsonObject
import io.vertx.ext.web.RoutingContext
import jakarta.enterprise.context.ApplicationScoped

import java.nio.file.Paths
import java.util.UUID

@ApplicationScoped
@Route(path = "/.well-known/appspecific/com.chrome.devtools.json")
class ChromeRoute extends Handler[RoutingContext]{

  override def handle(event: RoutingContext): Unit = {

    val cwd = Paths.get("./src/main/typescript/packages").toAbsolutePath.toString
    
    event.response().end(JsonObject.of(
      "workspace", JsonObject.of(
        "root" , cwd,
        "uuid" , UUID.randomUUID()
      )
    ).encode())

  }
}
