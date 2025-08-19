package com.anjunar.vertx

import com.anjunar.jaxrs.types.Table
import com.anjunar.scala.mapper.loader.JsonEntityLoader
import com.anjunar.scala.mapper.{JsonContext, JsonMapper}
import com.anjunar.scala.schema.builder.EntitySchemaBuilder
import com.anjunar.scala.schema.model.{Link, ObjectDescriptor}
import com.anjunar.scala.schema.{JsonDescriptorsContext, JsonDescriptorsGenerator}
import com.anjunar.scala.universe.TypeResolver
import com.anjunar.vertx.engine.{EntitySchemaDef, RequestContext}
import com.anjunar.vertx.fsm.FSMEngine
import com.anjunar.vertx.jaxrs.ResourceMethodInvoker
import com.typesafe.scalalogging.Logger
import io.vertx.core.http.HttpMethod
import io.vertx.core.json.JsonObject
import io.vertx.ext.auth.User
import io.vertx.ext.web.Router
import io.vertx.ext.web.handler.SessionHandler
import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.inject.Instance
import jakarta.inject.Inject
import jakarta.validation.Validator
import org.hibernate.reactive.stage.Stage

import java.lang.reflect.Type
import java.util
import java.util.UUID
import scala.jdk.CollectionConverters.*
import scala.compiletime.uninitialized

@ApplicationScoped
class VertxAPIEngine {

  val log = Logger[VertxAPIEngine]

  @Inject
  var instance: Instance[AnyRef] = uninitialized

  @Inject
  var resourceMethodInvoker : ResourceMethodInvoker = uninitialized

  @Inject
  var sessionFactory: Stage.SessionFactory = uninitialized

  def start(engine: FSMEngine, router: Router, sessionHandler: SessionHandler): Unit = {

    engine.fsm.transitions.foreach((state, transitions) => {

      val route = router.route("/service" + state.path)
        .method(HttpMethod.valueOf(state.httpMethod))

      state.consumes.foreach(contentType => route.consumes(contentType))
      state.produces.foreach(contentType => route.produces(contentType))

      route.handler(handler => {
        resourceMethodInvoker.invoke(handler, state, transitions, instance.select(state.resource).get)
          .andThen(result => {
            handler.end(result.result())
          })
      })

    })

  }

}
