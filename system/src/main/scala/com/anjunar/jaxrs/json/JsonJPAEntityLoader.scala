package com.anjunar.jaxrs.json

import com.anjunar.scala.mapper.annotations.DoNotLoad
import com.anjunar.scala.mapper.intermediate.model.JsonObject
import com.anjunar.scala.mapper.loader.JsonEntityLoader
import com.anjunar.scala.universe.ResolvedClass
import com.fasterxml.jackson.annotation.JsonSubTypes
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.persistence.{EntityManager, EntityManagerFactory}

import java.lang.annotation.Annotation
import java.util.UUID
import scala.compiletime.uninitialized

@ApplicationScoped
class JsonJPAEntityLoader extends JsonEntityLoader {

  @Inject
  var factory : EntityManagerFactory = uninitialized

  override def load(jsonObject: JsonObject, aType: ResolvedClass, annotations : Array[Annotation]): AnyRef = {

    val doNotLoad = annotations.find(annotation => annotation.annotationType() == classOf[DoNotLoad])

    val option = jsonObject.value.get("id")

    var entity: AnyRef = if (option.isDefined && doNotLoad.isEmpty) {
      val entityClass = aType.raw.asInstanceOf[Class[AnyRef]]
      val uuid = UUID.fromString(option.get.value.toString)
      factory.createEntityManager().find(entityClass, uuid)
    } else {
      null
    }

    if (entity == null) {
      val jsonSubTypes = aType.findDeclaredAnnotation(classOf[JsonSubTypes])
      if (jsonSubTypes == null) {
        entity = aType.findConstructor().newInstance().asInstanceOf[AnyRef]
      } else {
        val jsonType = jsonObject.value("$type")
        val maybeType = jsonSubTypes.value().find(subType => subType.value().getSimpleName == jsonType.value.toString)
        if (maybeType.isDefined) {
          entity = maybeType.get.value().getConstructor().newInstance().asInstanceOf[AnyRef]
        } else {
          throw new IllegalStateException("No Type found " + aType)
        }
      }
    }

    entity
  }
}
