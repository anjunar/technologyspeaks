package com.anjunar.vertx

import com.anjunar.vertx.fsm.FSMEngine
import com.anjunar.vertx.jaxrs.ResourceMethodInvoker
import com.google.common.collect.Lists
import com.typesafe.scalalogging.Logger
import io.vertx.core.http.HttpMethod
import io.vertx.core.json.JsonArray
import io.vertx.ext.auth.User
import io.vertx.ext.web.Router
import io.vertx.ext.web.handler.SessionHandler
import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.inject.Instance
import jakarta.inject.Inject

import scala.compiletime.uninitialized
import scala.jdk.CollectionConverters.*

@ApplicationScoped
class VertxAPIEngine {

  val log = Logger[VertxAPIEngine]

  @Inject
  var instance: Instance[AnyRef] = uninitialized

  @Inject
  var resourceMethodInvoker: ResourceMethodInvoker = uninitialized

  def start(engine: FSMEngine, router: Router, sessionHandler: SessionHandler): Unit = {

    engine.fsm.transitions.foreach((state, transitions) => {

      val route = router.route("/service" + state.path)
        .method(HttpMethod.valueOf(state.httpMethod))

      state.consumes.foreach(contentType => route.consumes(contentType))
      state.produces.foreach(contentType => route.produces(contentType))

      route.handler(handler => {
        val anonymous = User.fromName("Anonymous")
        anonymous.principal().put("roles", JsonArray(Lists.newArrayList("Anonymous")))
        val user = if handler.user() == null then anonymous else handler.user()
        val roles = if handler.user() == null then Set("Anonymous") else user.principal().getJsonArray("roles").getList.asScala.toSet.asInstanceOf[Set[String]]

        sessionHandler.setUser(handler, user)

        if (state.rolesAllowed.exists(roles.contains)) {
          resourceMethodInvoker.invoke(handler, sessionHandler, state, transitions, instance.select(state.resource).get)
            .exceptionally(exception => {
              log.error(exception.getMessage, exception)
              handler.fail(500, exception.getCause)
              (exception.getMessage, "text/plain")
            })
            .thenApply((contentType, result) => {
              handler.response()
                .putHeader("Content-Type", contentType)
                .send(result)
            })
        } else {
          handler.fail(403)
        }

      })

    })

  }

}
