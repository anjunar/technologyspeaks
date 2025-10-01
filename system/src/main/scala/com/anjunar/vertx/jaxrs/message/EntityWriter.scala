package com.anjunar.vertx.jaxrs.message

import com.anjunar.jaxrs.types.Table
import com.anjunar.scala.mapper.intermediate.model
import com.anjunar.scala.mapper.{IdProvider, JsonContext, JsonMapper}
import com.anjunar.scala.schema.builder.Schemas
import com.anjunar.scala.schema.model.{Link, ObjectDescriptor}
import com.anjunar.scala.schema.{JsonDescriptorsContext, JsonDescriptorsGenerator}
import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}
import com.anjunar.scala.universe.members.ResolvedMethod
import com.anjunar.vertx.engine.{DynamicSchemaProvider, EntitySchemaDef, RequestContext, SchemaProvider}
import com.anjunar.vertx.fsm.StateDef
import com.anjunar.vertx.jaxrs.MessageBodyWriter
import io.vertx.core.Future
import io.vertx.core.json.JsonObject
import io.vertx.ext.auth.User
import io.vertx.ext.web.RoutingContext
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.validation.Validator
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType
import org.hibernate.reactive.stage.Stage

import java.lang.annotation.Annotation
import java.lang.reflect.Type
import java.util.concurrent.{CompletableFuture, CompletionStage}
import scala.compiletime.uninitialized
import scala.jdk.CollectionConverters.*

@ApplicationScoped
class EntityWriter extends MessageBodyWriter {
  
  @Inject
  var validator : Validator = uninitialized

  override val contentType: String = MediaType.APPLICATION_JSON

  val jsonMapper = JsonMapper()

  override def canWrite(entity: Any, javaType: ResolvedClass, annotations: Array[Annotation], ctx: RoutingContext, state: StateDef[?], transitions: Seq[StateDef[?]]): Boolean = {
    val companion = TypeResolver.companionInstance(javaType.raw)
    if (companion == null) {
      false 
    } else {
      companion match {
        case clazz: SchemaProvider[?] => true
        case clazz: DynamicSchemaProvider => true
        case _ => false
      }
    }
  }

  override def write(entity: Any, resolvedClass: ResolvedClass, annotations: Array[Annotation], ctx : RoutingContext, state : StateDef[?], transitions : Seq[StateDef[?]], factory : Stage.Session): CompletionStage[String] = {

    val user = ctx.user()
    val roles = user.principal().getJsonArray("roles").getList.asScala.toSet.asInstanceOf[Set[String]]
    
    entity match {
      case table: Table[AnyRef] =>
        val tableType = resolvedClass.typeArguments(0).raw.asInstanceOf[Class[AnyRef]]
        val entitySchemaDef = Table.schema(tableType, state.view)
        val schemaBuilder = entitySchemaDef.build(entity.asInstanceOf[Table[AnyRef]], resolvedClass.raw.asInstanceOf[Class[Table[AnyRef]]], RequestContext(user, roles), factory, state.view)

        schemaBuilder.thenCompose(schemaBuilder => {

          val tableLinks = transitions
            .filter(state => (state.withLinks && !state.isRef || state.ref == classOf[Table[?]]) && state.rolesAllowed.exists(role => roles.contains(role)))
            .map(state => Link(state.path, state.httpMethod, state.rel, state.name))
          
          val classSchema = schemaBuilder.instances(entity)
          classSchema.links.addAll(tableLinks)
          
          table.rows.forEach(item => {
            val entityLinks = transitions
              .filter(state => (state.withLinks && !state.isRef || state.ref == item.getClass) && state.rolesAllowed.exists(role => roles.contains(role)))
              .map(state => Link(state.asInstanceOf[StateDef[Any]].generatePath(state.path,  item), state.httpMethod, state.rel, state.name))

            val rowsProperty = classSchema.properties.find((name, property) => name == "rows").get
            val itemSchema = rowsProperty._2.schemas.instances(item)
            itemSchema.links.addAll(entityLinks)
          })
          
          write2(entity, resolvedClass, schemaBuilder, factory)
        })
      case _ =>
        val entitySchemaDef = TypeResolver.companionInstance(resolvedClass.raw).asInstanceOf[SchemaProvider[Any]].schema
        val schemaBuilder = entitySchemaDef.build(entity, entity.getClass.asInstanceOf[Class[Any]], RequestContext(user, roles), factory, state.view)

        schemaBuilder.thenCompose(schemaBuilder => {

          val classSchema = schemaBuilder.instances(entity)
          val entityLinks = transitions
            .filter(state => (state.withLinks && !state.isRef || state.ref == resolvedClass.raw) && state.rolesAllowed.exists(role => roles.contains(role)))
            .map(state => Link(state.asInstanceOf[StateDef[Any]].generatePath(state.path,  entity), state.httpMethod, state.rel, state.name))
          
          classSchema.links.addAll(entityLinks)

          write2(entity, resolvedClass, schemaBuilder, factory)
        })
        
    }
  }

  def write2(entity: Any, resolvedClass: ResolvedClass, schemaBuilder: Schemas, session : Stage.Session): CompletionStage[String] = {
    val context = JsonContext(null, null, false, validator, jsonMapper.registry, schemaBuilder, null)

    jsonMapper.toJson(entity.asInstanceOf[AnyRef], resolvedClass, context)
      .thenCompose(jsonObject => {
        jsonMapper.toJsonObjectForJson(jsonObject)
      })
  }
}
