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

      val protocol = ctx.request().scheme()
      val path = ctx.request().path()
      val search = if (ctx.request().query() == null) "?" else "?" + ctx.request().query()
      val cookies = ctx.request().cookies()
      val host = ctx.request().authority().host() + (if ctx.request().authority().port() == -1 then "" else ":" + ctx.request().authority().port())
      val language = ctx.request().headers().get("Language")

      val requestInfo = new JsonObject()
        .put("document", htmlContent)
        .put("protocol", protocol)
        .put("host", host)
        .put("path", path)
        .put("search", search)
        .put("language", language)
        .put("cookie", {
          val cookieObj = new JsonObject()
          cookieObj.put("JSESSIONID", ctx.session().id())
          cookies.forEach { cookie =>
            cookieObj.put(cookie.getName, cookie.getValue)
          }
          cookieObj
        })

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
