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
      val vertx = ctx.vertx()
      val htmlContent = Files.readString(
        Paths.get("src/main/typescript/packages/technology-speaks/dist/client/index.html"),
        StandardCharsets.UTF_8
      )

      val protocol = ctx.request().scheme()
      val path = ctx.request().path()
      val search = if (ctx.request().query() == null) "?" else "?" + ctx.request().query()
      val cookies = ctx.request().cookies()
      val host = ctx.request().authority().host() + (if ctx.request().authority().port() == -1 then "" else ":" + ctx.request().authority().port())
      val language = ctx.request().headers().get("Language")

      val requestInfo = new JsonObject()
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

      val client: WebSocketClient = vertx.createWebSocketClient()

      val options = new WebSocketConnectOptions()
        .setHost("localhost")
        .setPort(8081)
        .setURI("/")

      val future: Future[io.vertx.core.http.WebSocket] = client.connect(options)

      future
        .onSuccess { ws =>
          println("Connected to WebSocket server")

          ws.textMessageHandler { message =>
            val json = new JsonObject(message)
            json.getString("type") match {
              case "ready" =>
                val payload = new JsonObject()
                  .put("request", requestInfo)
                  .put("html", htmlContent)
                ws.write(Buffer.buffer(payload.encode()))
              case "html" =>
                ctx.response()
                  .putHeader("content-type", "text/html")
                  .end(json.getString("html"))
                ws.close()
              case "redirect" =>
                ctx.response()
                  .putHeader("location", json.getString("url"))
                  .setStatusCode(302)
                  .end()
                ws.close()
              case "error" =>
                log.error(json.getString("stack"))
                ctx.fail(json.getInteger("code"))
                ws.close()
              case "exception" =>
                ctx.response().end(json.encodePrettily())
                ws.close()
              case _ =>
                ctx.fail(500)
                ws.close()
            }
          }

          ws.closeHandler { _ =>
            println("WebSocket connection closed")
          }

          ws.exceptionHandler { throwable =>
            println(s"Error: ${throwable.getMessage}")
          }
        }
        .onFailure { throwable =>
          println(s"Failed to connect: ${throwable.getMessage}")
          client.close()
//          vertx.close()
        }

    })
  }
}
