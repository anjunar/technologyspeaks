package com.anjunar.vertx

import com.anjunar.scala.mapper.loader.JsonEntityLoader
import com.anjunar.scala.mapper.{JsonContext, JsonMapper}
import com.anjunar.scala.schema.builder.EntitySchemaBuilder
import com.anjunar.scala.schema.model.{Link, ObjectDescriptor}
import com.anjunar.scala.schema.{JsonDescriptorsContext, JsonDescriptorsGenerator}
import com.anjunar.scala.universe.TypeResolver
import com.anjunar.vertx.engine.{EntitySchemaDef, RequestContext}
import com.anjunar.vertx.fsm.FSMEngine
import com.anjunar.vertx.fsm.services.{DefaultFSMService, FSMService, JsonFSMService, TableFSMService}
import com.anjunar.vertx.fsm.states.*
import com.google.common.collect.Lists
import com.typesafe.scalalogging.Logger
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
import java.util.UUID
import scala.compiletime.uninitialized
import java.util
import scala.collection.JavaConverters.asScalaBufferConverter

@ApplicationScoped
class VertxAPIEngine {

  val log = Logger[VertxAPIEngine]

  @Inject
  var entityLoader: JsonEntityLoader = uninitialized

  @Inject
  var instance: Instance[FSMService] = uninitialized

  @Inject
  var validator: Validator = uninitialized

  @Inject
  var sessionFactory: Stage.SessionFactory = uninitialized

  def start(engine: FSMEngine, router: Router, sessionHandler: SessionHandler): Unit = {

    try {
      engine.fsm.transitions.foreach((state, transitions) => {
        val entitySchemaDef = if (state.entity != classOf[JsonObject]) {
          val resolvedClass = TypeResolver.resolve(state.entity)
          val resolvedMethod = resolvedClass.findMethod("schema")
          Some(resolvedMethod.invoke(null).asInstanceOf[EntitySchemaDef[AnyRef]])
        } else {
          None
        }

        router.route("/service" + state.url).handler(event => {

          event.put("sessionHandler", sessionHandler)

          val user = if event.user() == null then User.fromName("Guest") else event.user()
          val list = user.principal().getJsonArray("roles")
          val roles = if list == null then Set("Guest") else list.getList.asInstanceOf[util.List[String]].asScala.toSet

          state match {
            case formState: FormStateDef =>
              event.request().method().name() match {
                case "GET" =>
                  val id = UUID.fromString(event.pathParam("id"))
                  sessionFactory
                    .withTransaction(session => {
                      session.find(state.entity, id)
                        .thenApply(entity => {
                          event.response()
                            .putHeader("Content-Type", state.contentType)
                            .end(serialize(engine, state, entitySchemaDef, entity, user, roles))
                        })
                    })
                case "PUT" =>
                  val entity = deserialize(state, entitySchemaDef, event.body().asString(), state.entity, user, roles)
                  event.end()
              }
            case jsonState: JsonStateDef =>
              val service = instance.select(jsonState.service).get()
              service.run(event, deserialize(state, entitySchemaDef, event.body().asString(), jsonState.entity, user, roles))
                .onComplete(
                  success => {
                    event.response()
                      .putHeader("Content-Type", state.contentType)
                      .end(serialize(engine, state, entitySchemaDef, success, user, roles))
                  },
                  failure => {
                    event.fail(failure.getCause)
                  }
                )
            case defaultState: DefaultStateDef =>
              val service = instance.select(defaultState.service).get()

              service.run(event)
                .andThen(application => {
                  event.response()
                    .putHeader("Content-Type", state.contentType)
                    .end(serialize(engine, state, entitySchemaDef, application.result(), user, roles))
                })
            case tableSearch: TableSearchStateDef =>
              val service = instance.select(tableSearch.service).get()

              service.search(result => event.response()
                .putHeader("Content-Type", state.contentType)
                .end(serialize(engine, state, entitySchemaDef, result, user, roles))
              )
            case tableSearch: TableListStateDef =>
              val service = instance.select(tableSearch.service).get()

              service.list(result => event.response()
                .putHeader("Content-Type", state.contentType)
                .end(serialize(engine, state, entitySchemaDef, result, user, roles))
              )
          }

        })

      })
    } catch {
      case e: Exception => log.error(e.getMessage, e)
    }


  }

  private def serialize[E](engine: FSMEngine, state: StateDef[?], entitySchemaDef: Option[EntitySchemaDef[E]], result: Any, user: User, roles: Set[String]) = {
    if (entitySchemaDef.isDefined) {
      val schemaBuilder = entitySchemaDef.get.build(result.asInstanceOf[E], RequestContext(user, roles), state.view)

      val transitions = engine.fsm.transitions(state)

      schemaBuilder.forInstance(result, result.getClass.asInstanceOf[Class[Any]], (builder: EntitySchemaBuilder[Any]) => {
        builder.withLinks((entity, context) => {
          transitions.foreach(state => {
            context.addLink(state.name, Link(state.url, state.method, state.name, state.name))
          })
        })
      })

      val jsonMapper = JsonMapper()

      val context = JsonContext(null, null, false, validator, jsonMapper.registry, schemaBuilder, entityLoader)

      val resolvedClass = TypeResolver.resolve(state.entity)

      val jsonObject = jsonMapper.toJson(result.asInstanceOf[AnyRef], resolvedClass, context)

      val objectDescriptor = JsonDescriptorsGenerator.generateObject(resolvedClass, schemaBuilder, JsonDescriptorsContext(null))

      jsonObject.value.put("$descriptors", jsonMapper.toJson(objectDescriptor, TypeResolver.resolve(classOf[ObjectDescriptor]), context))

      val string = jsonMapper.toJsonObjectForJson(jsonObject)
      string
    } else {
      result.toString
    }
  }

  private def deserialize[E](state: StateDef[?], entitySchemaDef: Option[EntitySchemaDef[AnyRef]], result: String, aType: Type, user: User, roles: Set[String]) : E = {
    if (entitySchemaDef.isDefined) {
      val jsonMapper = JsonMapper()

      val jsonObject = jsonMapper.toJsonObjectForJava(result)

      val entity = entityLoader.load(jsonObject, TypeResolver.resolve(aType))

      val schemaBuilder = entitySchemaDef.get.build(entity, RequestContext(user, roles), state.view)

      val context = JsonContext(null, null, false, validator, jsonMapper.registry, schemaBuilder, entityLoader)

      jsonMapper.toJava(jsonObject, TypeResolver.resolve(aType), context).asInstanceOf[E]
    } else {
      new JsonObject(result).asInstanceOf[E]
    }
  }

}
