package com.anjunar.vertx.jaxrs.params

import com.anjunar.scala.mapper.loader.JsonEntityLoader
import com.anjunar.scala.mapper.{JsonContext, JsonMapper}
import com.anjunar.scala.universe.TypeResolver
import com.anjunar.scala.universe.members.ResolvedMethod
import com.anjunar.vertx.engine.{EntitySchemaDef, RequestContext}
import com.anjunar.vertx.fsm.StateDef
import com.anjunar.vertx.jaxrs.ParamReader
import io.vertx.core.Future
import io.vertx.ext.auth.User
import io.vertx.ext.web.RoutingContext
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.core.Context
import jakarta.ws.rs.{BeanParam, MatrixParam, PathParam, QueryParam}

import java.lang.annotation.Annotation
import java.lang.reflect.Type
import scala.compiletime.uninitialized
import scala.jdk.CollectionConverters.*

@ApplicationScoped
class EntityParamReader extends ParamReader {
  
  @Inject
  var entityLoader : JsonEntityLoader = uninitialized

  override def canRead(ctx: RoutingContext, javaType: Type, annotations: Array[Annotation], method: ResolvedMethod): Boolean = {
    val blackList : Set[Class[? <: Annotation]] = Set(classOf[QueryParam], classOf[BeanParam], classOf[PathParam], classOf[MatrixParam], classOf[Context])
    TypeResolver.resolve(javaType).findMethod("schema") != null && ! annotations.exists(annotation => blackList.contains(annotation.annotationType()))
  }

  override def read(ctx: RoutingContext, javaType: Type, annotations: Array[Annotation], method: ResolvedMethod, state : StateDef): Future[Any] = {
    val user = if ctx.user() == null then User.fromName("Guest") else ctx.user()
    val roles = if ctx.user() == null then Set("Guest") else user.principal().getJsonArray("roles").getList.asScala.toSet.asInstanceOf[Set[String]]

    val jsonMapper = JsonMapper()

    val jsonObject = jsonMapper.toJsonObjectForJava(ctx.body().asString())

    val resolvedClass = TypeResolver.resolve(javaType)
    
    val entity = entityLoader.load(jsonObject, resolvedClass)

    val entitySchemaDef = resolvedClass.findMethod("schema").invoke(null).asInstanceOf[EntitySchemaDef[AnyRef]]
    
    val schemaBuilder = entitySchemaDef.build(entity, RequestContext(user, roles), state.view)

    val context = JsonContext(null, null, false, null, jsonMapper.registry, schemaBuilder, entityLoader)

    val value = jsonMapper.toJava(jsonObject, resolvedClass, context)
    
    Future.succeededFuture(value)
  }
}
