package com.anjunar.vertx.jaxrs.params

import com.anjunar.scala.mapper.loader.JsonEntityLoader
import com.anjunar.scala.mapper.{EntitySecurity, JsonContext, JsonMapper}
import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}
import com.anjunar.scala.universe.members.ResolvedMethod
import com.anjunar.vertx.engine.{DynamicSchemaProvider, EntitySchemaDef, RequestContext, SchemaProvider}
import com.anjunar.vertx.fsm.StateDef
import com.anjunar.vertx.jaxrs.ParamReader
import io.vertx.core.Future
import io.vertx.ext.auth.User
import io.vertx.ext.web.RoutingContext
import io.vertx.ext.web.handler.SessionHandler
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.validation.Validator
import jakarta.ws.rs.core.Context
import jakarta.ws.rs.{BeanParam, MatrixParam, PathParam, QueryParam}
import org.hibernate.reactive.stage.Stage

import java.lang.annotation.Annotation
import java.lang.reflect.Type
import java.util.concurrent.{CompletableFuture, CompletionStage}
import scala.compiletime.uninitialized
import scala.jdk.CollectionConverters.*

@ApplicationScoped
class EntityParamReader extends ParamReader {
  
  @Inject
  var entityLoader : JsonEntityLoader = uninitialized
  
  @Inject
  var sessionFactory : Stage.SessionFactory = uninitialized  
  
  @Inject
  var validator : Validator = uninitialized
  
  @Inject
  var entitySecurity : EntitySecurity = uninitialized

  override def canRead(ctx: RoutingContext, javaType: ResolvedClass, annotations: Array[Annotation]): Boolean = {
    val blackList : Set[Class[? <: Annotation]] = Set(classOf[QueryParam], classOf[BeanParam], classOf[PathParam], classOf[MatrixParam], classOf[Context])

    val companion = TypeResolver.companionInstance(javaType.raw)
    if (companion == null) {
      false
    } else {
      companion match {
        case clazz: SchemaProvider[?] => !annotations.exists(annotation => blackList.contains(annotation.annotationType()))
        case clazz: DynamicSchemaProvider => !annotations.exists(annotation => blackList.contains(annotation.annotationType()))
        case _ => false
      }
    }
  }

  override def read(ctx: RoutingContext, sessionHandler: SessionHandler, resolvedClass: ResolvedClass, annotations: Array[Annotation], state: StateDef, factory : Stage.SessionFactory): CompletionStage[Any] = {
    val user = ctx.user()
    val roles = user.principal().getJsonArray("roles").getList.asScala.toSet.asInstanceOf[Set[String]]

    val jsonMapper = JsonMapper()

    jsonMapper.toJsonObjectForJava(ctx.body().asString())
      .thenCompose(jsonObject => {
        entityLoader.load(jsonObject, resolvedClass)
          .thenCompose(entity => {
            val entitySchemaDef = TypeResolver.companionInstance(resolvedClass.raw).asInstanceOf[SchemaProvider[AnyRef]].schema

            entitySchemaDef.build(entity, entity.getClass.asInstanceOf[Class[AnyRef]], RequestContext(user, roles), factory, state.view)
              .thenCompose(schemaBuilder => {
                val context = JsonContext(null, null, false, validator, jsonMapper.registry, schemaBuilder, entityLoader)

                jsonMapper.toJava(jsonObject, entity, resolvedClass, context)
                  .thenApply(entity => {
                    this.entitySecurity.checkRestrictionAndViolations(annotations, context, entity)
                  })
              })

          })
      })


  }
}
