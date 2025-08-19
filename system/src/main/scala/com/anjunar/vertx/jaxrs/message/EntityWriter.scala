package com.anjunar.vertx.jaxrs.message

import com.anjunar.jaxrs.types.Table
import com.anjunar.scala.mapper.{JsonContext, JsonMapper}
import com.anjunar.scala.schema.builder.{EntitySchemaBuilder, SchemaBuilder}
import com.anjunar.scala.schema.model.{Link, ObjectDescriptor}
import com.anjunar.scala.schema.{JsonDescriptorsContext, JsonDescriptorsGenerator}
import com.anjunar.scala.universe.TypeResolver
import com.anjunar.scala.universe.members.ResolvedMethod
import com.anjunar.vertx.engine.{EntitySchemaDef, RequestContext}
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

import java.lang.annotation.Annotation
import java.lang.reflect.Type
import scala.compiletime.uninitialized
import scala.jdk.CollectionConverters.*

@ApplicationScoped
@Produces(Array(MediaType.APPLICATION_JSON))
class EntityWriter extends MessageBodyWriter {
  
  @Inject
  var validator : Validator = uninitialized

  override def canWrite(entity: Any, javaType: Type, annotations: Array[Annotation], ctx: RoutingContext, state: StateDef, transitions: Seq[StateDef]): Boolean = {
    TypeResolver.resolve(javaType).typeArguments(0).findMethod("schema") != null
  }

  override def write(entity: Any, javaType: Type, annotations: Array[Annotation], ctx : RoutingContext, state : StateDef, transitions : Seq[StateDef]): Future[String] = {

    val user = if ctx.user() == null then User.fromName("Guest") else ctx.user()
    val roles = if ctx.user() == null then Set("Guest") else user.principal().getJsonArray("roles").getList.asScala.toSet.asInstanceOf[Set[String]]
    
    entity match {
      case table: Table[AnyRef] =>
        val resolvedClass = TypeResolver.resolve(javaType)
        val tableType = resolvedClass.typeArguments(0).raw.asInstanceOf[Class[AnyRef]]
        val entitySchemaDef = Table.schema(tableType, state.view)
        val schemaBuilder = entitySchemaDef.build(entity.asInstanceOf[Table[AnyRef]], RequestContext(user, roles), state.view)
        val schemaBuilderType = entitySchemaDef.buildType(resolvedClass.raw.asInstanceOf[Class[Table[AnyRef]]], RequestContext(user, roles), state.view)

        table.rows.forEach(item => {
          schemaBuilder.forInstance(item, item.getClass.asInstanceOf[Class[Any]], (builder: EntitySchemaBuilder[Any]) => {
            builder.withLinks((entity, context) => {
              transitions
                .filter(state => !state.isRef || state.ref == item.getClass)
                .foreach(state => {
                  context.addLink(state.rel, Link(state.path, state.httpMethod, state.rel, state.name))
                })
            })
          })
        })
        schemaBuilder.forInstance(entity, resolvedClass.raw.asInstanceOf[Class[Any]], (builder: EntitySchemaBuilder[Any]) => {
          builder.withLinks((entity, context) => {
            transitions
              .filter(state => !state.isRef || state.ref == resolvedClass.raw)
              .foreach(state => {
                context.addLink(state.rel, Link(state.path, state.httpMethod, state.rel, state.name))
              })
          })
        })
        write(entity, javaType, schemaBuilder, schemaBuilderType)
      case _ =>
        val resolvedClass = TypeResolver.resolve(javaType).typeArguments(0)
        val resolvedMethod = resolvedClass.findMethod("schema")
        val entitySchemaDef = resolvedMethod.invoke(null).asInstanceOf[EntitySchemaDef[Any]]
        val schemaBuilder = entitySchemaDef.build(entity, RequestContext(user, roles), state.view)
        val schemaBuilderType = entitySchemaDef.buildType(resolvedClass.raw.asInstanceOf[Class[Any]], RequestContext(user, roles), state.view)

        schemaBuilder.forInstance(entity, resolvedClass.raw.asInstanceOf[Class[Any]], (builder: EntitySchemaBuilder[Any]) => {
          builder.withLinks((entity, context) => {
            transitions
              .filter(state => !state.isRef || state.ref == resolvedClass.raw)
              .foreach(state => {
                context.addLink(state.rel, Link(state.path, state.httpMethod, state.rel, state.name))
              })
          })
        })
        write(entity, javaType, schemaBuilder, schemaBuilderType)
    }
  }

  def write(entity: Any, javaType: Type, schemaBuilder: SchemaBuilder, schemaBuilderType: SchemaBuilder) = {
    val jsonMapper = JsonMapper()

    val context = JsonContext(null, null, false, validator, jsonMapper.registry, schemaBuilder, null)

    val resolvedClass = TypeResolver.resolve(javaType)

    val jsonObject = jsonMapper.toJson(entity.asInstanceOf[AnyRef], resolvedClass, context)

    val objectDescriptor = JsonDescriptorsGenerator.generateObject(resolvedClass, schemaBuilderType, JsonDescriptorsContext(null))

    jsonObject.value.put("$descriptors", jsonMapper.toJson(objectDescriptor, TypeResolver.resolve(classOf[ObjectDescriptor]), context))

    val string = jsonMapper.toJsonObjectForJson(jsonObject)

    Future.succeededFuture(string)
  }
}
