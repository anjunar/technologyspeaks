package com.anjunar.vertx

import com.anjunar.scala.mapper.loader.JsonEntityLoader
import com.anjunar.scala.mapper.{JsonContext, JsonMapper}
import com.anjunar.scala.schema.engine.{EntitySchemaDef, RequestContext, User}
import com.anjunar.scala.universe.TypeResolver
import com.anjunar.vertx.fsm.FSMEngine
import com.anjunar.vertx.fsm.services.{DefaultFSMService, FSMService, JsonFSMService, TableFSMService}
import com.anjunar.vertx.fsm.states.*
import com.typesafe.scalalogging.Logger
import io.vertx.core.json.JsonObject
import io.vertx.ext.web.Router
import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.inject.Instance
import jakarta.inject.Inject
import jakarta.validation.Validator

import java.lang.reflect.Type
import java.util.UUID
import scala.compiletime.uninitialized

@ApplicationScoped
class VertxAPIEngine {

  val log = Logger[VertxAPIEngine]

  @Inject
  var entityLoader: JsonEntityLoader = uninitialized

  @Inject
  var instance: Instance[FSMService] = uninitialized

  @Inject
  var validator: Validator = uninitialized

  def start(engine: FSMEngine, router: Router): Unit = {

    try {
      engine.fsm.transitions.foreach((state, transitions) => {
        val entitySchemaDef = if (state.entity != classOf[JsonObject]) {
          val resolvedClass = TypeResolver.resolve(state.entity)
          val resolvedMethod = resolvedClass.findMethod("schema")
          Some(resolvedMethod.invoke(null).asInstanceOf[EntitySchemaDef[AnyRef]])
        } else {
          None
        }

        val service = instance.select(state.service).get().asInstanceOf[FSMService]

        val user = new User {
          val id = UUID.randomUUID()
        }

        val roles = Set("Administrator")


        router.route("/service" + state.url).handler(event => {

          state match {
            case jsonState: JsonStateDef =>
              service match {
                case service: JsonFSMService[AnyRef] =>
                  service.run(event, deserialize(state, entitySchemaDef, event.body().asString(), state.entity, user, roles))
                    .onComplete(
                      success => {
                        event.end(serialize(state, entitySchemaDef, success, user, roles))
                      },
                      failure => {
                        event.fail(failure.getCause)
                      }
                    )
              }
            case defaultState: DefaultStateDef =>
              service match {
                case service: DefaultFSMService[AnyRef] =>
                  service.run(result => event.end(serialize(state, entitySchemaDef, result, user, roles)))
              }
            case tableSearch: TableSearchStateDef =>
              service match {
                case service: TableFSMService[AnyRef, AnyRef] =>
                  service.search(result => event.end(serialize(state, entitySchemaDef, result, user, roles)))
              }
            case tableSearch: TableListStateDef =>
              service match {
                case service: TableFSMService[AnyRef, AnyRef] =>
                  service.list(result => event.end(serialize(state, entitySchemaDef, result, user, roles)))
              }
          }

        })

      })
    } catch {
      case e: Exception => log.error(e.getMessage, e)
    }


  }

  private def serialize(state: StateDef[?], entitySchemaDef: Option[EntitySchemaDef[AnyRef]], result: AnyRef, user: User, roles: Set[String]) = {
    if (entitySchemaDef.isDefined) {
      val schemaBuilder = entitySchemaDef.get.build(result, RequestContext(user, roles), state.view)

      val jsonMapper = JsonMapper()

      val context = JsonContext(null, null, false, validator, jsonMapper.registry, schemaBuilder, entityLoader)

      val jsonObject = jsonMapper.toJson(result, TypeResolver.resolve(state.entity), context)

      val string = jsonMapper.toJsonObjectForJson(jsonObject)
      string
    } else {
      result.toString
    }
  }

  private def deserialize(state: StateDef[?], entitySchemaDef: Option[EntitySchemaDef[AnyRef]], result: String, aType: Type, user: User, roles: Set[String]) = {
    if (entitySchemaDef.isDefined) {
      val schemaBuilder = entitySchemaDef.get.build(result, RequestContext(user, roles), state.view)

      val jsonMapper = JsonMapper()

      val context = JsonContext(null, null, false, validator, jsonMapper.registry, schemaBuilder, entityLoader)

      val jsonObject = jsonMapper.toJsonObjectForJava(result)

      val string = jsonMapper.toJava(jsonObject, TypeResolver.resolve(aType), context)
      string
    } else {
      JsonObject.mapFrom(result)
    }
  }

}
