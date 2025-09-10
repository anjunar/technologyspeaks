package com.anjunar.vertx.jaxrs.message

import com.anjunar.jaxrs.types.Table
import com.anjunar.scala.mapper.{JsonContext, JsonMapper}
import com.anjunar.scala.schema.builder.{EntitySchemaBuilder, SchemaBuilder}
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

  @Inject
  var sessionFactory: Stage.SessionFactory = uninitialized

  override val contentType: String = MediaType.APPLICATION_JSON

  override def canWrite(entity: Any, javaType: ResolvedClass, annotations: Array[Annotation], ctx: RoutingContext, state: StateDef, transitions: Seq[StateDef]): Boolean = {
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

  override def write(entity: Any, resolvedClass: ResolvedClass, annotations: Array[Annotation], ctx : RoutingContext, state : StateDef, transitions : Seq[StateDef], factory : Stage.SessionFactory): CompletionStage[String] = {

    val user = ctx.user()
    val roles = user.principal().getJsonArray("roles").getList.asScala.toSet.asInstanceOf[Set[String]]
    
    entity match {
      case table: Table[AnyRef] =>
        val tableType = resolvedClass.typeArguments(0).raw.asInstanceOf[Class[AnyRef]]
        val entitySchemaDef = Table.schema(tableType, state.view)
        val schemaBuilder = entitySchemaDef.build(entity.asInstanceOf[Table[AnyRef]], RequestContext(user, roles), factory, state.view)
        val schemaBuilderType = entitySchemaDef.buildType(resolvedClass.raw.asInstanceOf[Class[Table[AnyRef]]], RequestContext(user, roles), state.view)
        
        schemaBuilder.thenCompose(schemaBuilder => {
          table.rows.forEach(item => {
            schemaBuilder.forInstance(item, item.getClass.asInstanceOf[Class[Any]], (builder: EntitySchemaBuilder[Any]) => {
              builder.withLinks((entity, context) => {
                transitions
                  .filter(state => (!state.isRef || state.ref == item.getClass) && state.rolesAllowed.exists(role => roles.contains(role)))
                  .foreach(state => {
                    context.addLink(state.rel, Link(state.path, state.httpMethod, state.rel, state.name))
                  })
              })
            })
          })
          schemaBuilder.forInstance(entity, resolvedClass.raw.asInstanceOf[Class[Any]], (builder: EntitySchemaBuilder[Any]) => {
            builder.withLinks((entity, context) => {
              transitions
                .filter(state => (!state.isRef || state.ref == classOf[Table[?]]) && state.rolesAllowed.exists(role => roles.contains(role)))
                .foreach(state => {
                  context.addLink(state.rel, Link(state.path, state.httpMethod, state.rel, state.name))
                })
            })
          })
          write2(entity, resolvedClass, schemaBuilder, schemaBuilderType, factory)
        })
      case _ =>
        val entitySchemaDef = TypeResolver.companionInstance(resolvedClass.raw).asInstanceOf[SchemaProvider[Any]].schema
        val schemaBuilder = entitySchemaDef.build(entity, RequestContext(user, roles), factory, state.view)
        val schemaBuilderType = entitySchemaDef.buildType(resolvedClass.raw.asInstanceOf[Class[Any]], RequestContext(user, roles), state.view)

        schemaBuilder.thenCompose(schemaBuilder => {
          schemaBuilder.forInstance(entity, resolvedClass.raw.asInstanceOf[Class[Any]], (builder: EntitySchemaBuilder[Any]) => {
            builder.withLinks((entity, context) => {
              transitions
                .filter(state => (!state.isRef || state.ref == resolvedClass.raw) && state.rolesAllowed.exists(role => roles.contains(role)))
                .foreach(state => {
                  context.addLink(state.rel, Link(state.path, state.httpMethod, state.rel, state.name))
                })
            })
          })
          write2(entity, resolvedClass, schemaBuilder, schemaBuilderType, factory)
        })
        
    }
  }

  def write2(entity: Any, resolvedClass: ResolvedClass, schemaBuilder: SchemaBuilder, schemaBuilderType: SchemaBuilder, session : Stage.SessionFactory): CompletionStage[String] = {
    val jsonMapper = JsonMapper()

    val context = JsonContext(null, null, false, validator, jsonMapper.registry, schemaBuilder, null)

    jsonMapper.toJson(entity.asInstanceOf[AnyRef], resolvedClass, context)
      .thenCompose(jsonObject => {
        val objectDescriptor = JsonDescriptorsGenerator.generateObject(resolvedClass, schemaBuilderType, JsonDescriptorsContext(null))

        jsonMapper.toJson(objectDescriptor, TypeResolver.resolve(classOf[ObjectDescriptor]), context)
          .thenCompose(descriptors => {
            jsonObject.value.put("$descriptors", descriptors)

            jsonMapper.toJsonObjectForJson(jsonObject)
          })
      })
  }
}
