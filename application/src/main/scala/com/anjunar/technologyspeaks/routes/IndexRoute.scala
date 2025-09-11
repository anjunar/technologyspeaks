package com.anjunar.technologyspeaks.routes

import com.anjunar.vertx.annotations.Route
import com.typesafe.scalalogging.Logger
import io.vertx.core.buffer.Buffer
import io.vertx.core.http.{WebSocketClient, WebSocketConnectOptions}
import io.vertx.core.json.JsonObject
import io.vertx.core.{Future, Handler}
import io.vertx.ext.web.RoutingContext
import jakarta.enterprise.context.ApplicationScoped

import java.nio.charset.StandardCharsets
import java.nio.file.{Files, Paths}

@Route(path = "/*", order = 9999)
@ApplicationScoped
class IndexRoute extends Handler[RoutingContext] {

  val log = Logger[IndexRoute]

  override def handle(ctx: RoutingContext): Unit = {

    ctx.vertx().executeBlocking(() => {

      val htmlContent = Files.readString(
        Paths.get("src/main/javascript/workspace/dist/technology-speaks/browser/index.html"),
        StandardCharsets.UTF_8
      )

      val path = ctx.request().path()

      val requestInfo = new JsonObject()
        .put("url", path)
        .put("document", htmlContent)

      val client: WebSocketClient = ctx.vertx().createWebSocketClient()
      val options = new WebSocketConnectOptions()
        .setHost("localhost")
        .setPort(4001)
        .setURI("/")

      client.connect(options).onSuccess { ws =>

        log.info("Connected to WebSocket server")

        ws.textMessageHandler { message =>
          val json = new JsonObject(message)
          if (json.getBoolean("success", false)) {
            ctx.response()
              .putHeader("Content-Type", "text/html")
              .end(json.getString("html"))
          } else {
            ctx.response()
              .setStatusCode(500)
              .end(s"SSR Error: ${json.getString("error")}")
          }
          ws.close()
        }

        ws.exceptionHandler { throwable =>
          ctx.response()
            .setStatusCode(500)
            .end(s"WebSocket Error: ${throwable.getMessage}")
        }

        ws.closeHandler { _ =>
          log.info("WebSocket connection closed")
        }

        ws.writeTextMessage(requestInfo.encode())

      }.onFailure { throwable =>
        log.error("Failed to connect to SSR server", throwable)
        ctx.response()
          .setStatusCode(500)
          .end(s"Failed to connect to SSR server: ${throwable.getMessage}")
        client.close()
      }

    })
  }
}
