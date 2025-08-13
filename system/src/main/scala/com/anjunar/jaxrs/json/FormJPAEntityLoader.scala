package com.anjunar.jaxrs.json

import com.anjunar.scala.mapper.annotations.DoNotLoad
import com.anjunar.scala.mapper.intermediate.model.JsonObject
import com.anjunar.scala.mapper.loader.{FormEntityLoader, JsonEntityLoader}
import com.anjunar.scala.universe.ResolvedClass
import com.fasterxml.jackson.annotation.JsonSubTypes
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.persistence.{EntityManager, EntityManagerFactory}

import java.lang.annotation.Annotation
import java.util.UUID
import scala.compiletime.uninitialized

@ApplicationScoped
class FormJPAEntityLoader extends FormEntityLoader {

  @Inject
  var factory : EntityManagerFactory = uninitialized

  override def load(fields: Map[String, List[String]], aType: ResolvedClass, annotations: Array[Annotation]): AnyRef = {
    val doNotLoad = annotations.find(annotation => annotation.annotationType() == classOf[DoNotLoad])

    val idValue = fields.get("id")

    var entity: AnyRef = if (idValue.isDefined) {
      val option = idValue.get.headOption
      if (option.isDefined && doNotLoad.isEmpty) {
        val entityClass = aType.raw.asInstanceOf[Class[AnyRef]]
        val uuid = UUID.fromString(option.get)
        factory.createEntityManager().find(entityClass, uuid)
      } else {
        null
      }
    } else {
      null
    }

    if (entity == null) {
      val jsonSubTypes = aType.findDeclaredAnnotation(classOf[JsonSubTypes])
      if (jsonSubTypes == null) {
        entity = aType.findConstructor().newInstance().asInstanceOf[AnyRef]
      } else {
        val jsonType = fields("$type").head
        val maybeType = jsonSubTypes.value().find(subType => subType.value().getSimpleName == jsonType)
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
