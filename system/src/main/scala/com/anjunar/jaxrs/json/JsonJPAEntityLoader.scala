package com.anjunar.jaxrs.json

import com.anjunar.jaxrs.search.jpa.{JPASearch, JPAUtil}
import com.anjunar.scala.mapper.annotations.DoNotLoad
import com.anjunar.scala.mapper.intermediate.model.JsonObject
import com.anjunar.scala.mapper.loader.JsonEntityLoader
import com.anjunar.scala.universe.ResolvedClass
import com.fasterxml.jackson.annotation.JsonSubTypes
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.persistence.{Entity, EntityManager, EntityManagerFactory}
import org.hibernate.reactive.stage.Stage

import java.lang.annotation.Annotation
import java.util.UUID
import java.util.concurrent.{CompletableFuture, CompletionStage}
import scala.compiletime.uninitialized

@ApplicationScoped
class JsonJPAEntityLoader extends JsonEntityLoader {
  
  @Inject
  var sessionFactory : Stage.SessionFactory = uninitialized

  override def load(jsonObject: JsonObject, aType: ResolvedClass): CompletionStage[AnyRef] = {

    val option = jsonObject.value.get("id")

    if (option.isDefined && aType.findAnnotation(classOf[Entity]) != null) {
      val entityClass = aType.raw.asInstanceOf[Class[AnyRef]]
      val uuid = UUID.fromString(option.get.value.toString)
      sessionFactory.openSession().thenCompose(session => {
        session.find(entityClass, uuid)
          .thenCompose(entity => {
            if (entity == null) {
              CompletableFuture.completedFuture(newInstance(jsonObject, aType))
            } else {
              JPAUtil.fetchEntityRecursively(entity, entityClass, session)
                .thenApply(_ => {
                  entity
                })
            }
          })
          .whenComplete((_,_) => {
            session.close()
          })
      })

    } else {
      CompletableFuture.completedFuture(newInstance(jsonObject, aType))
    }
  }

  private def newInstance(jsonObject: JsonObject, aType: ResolvedClass) = {
    val jsonSubTypes = aType.findDeclaredAnnotation(classOf[JsonSubTypes])
    if (jsonSubTypes == null) {
      aType.findConstructor().newInstance().asInstanceOf[AnyRef]
    } else {
      val jsonType = jsonObject.value("$type")
      val maybeType = jsonSubTypes.value().find(subType => subType.value().getSimpleName == jsonType.value.toString)
      if (maybeType.isDefined) {
        maybeType.get.value().getConstructor().newInstance().asInstanceOf[AnyRef]
      } else {
        throw new IllegalStateException("No Type found " + aType)
      }
    }
  }
}
