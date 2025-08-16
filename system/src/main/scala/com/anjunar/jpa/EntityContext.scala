package com.anjunar.jpa

import com.anjunar.scala.mapper.IdProvider
import com.anjunar.scala.mapper.exceptions.{ValidationException, ValidationViolation}
import com.anjunar.scala.universe.TypeResolver
import io.smallrye.mutiny.Uni
import jakarta.enterprise.inject.spi.CDI
import jakarta.persistence.EntityManager
import jakarta.validation.Validator
import org.hibernate.reactive.mutiny.Mutiny
import org.hibernate.reactive.stage.Stage

import java.util
import java.util.concurrent.CompletionStage

trait EntityContext[E <: EntityContext[E]] extends IdProvider { self: E =>

  def persist() : CompletionStage[Void] = {
    sessionFactory.withTransaction(session => {
      session.persist(self)
    })
  }
  
  def merge() : CompletionStage[E] = {
    sessionFactory.withTransaction(session => {
      session.merge(self)
    })
  }

  def delete(): CompletionStage[Void] = {
    sessionFactory.withTransaction(session => {
      session.remove(self)
    })
  }

  def validate(groups: Class[?]*): Unit = {
    val constraintViolation = CDI.current().select(classOf[Validator]).get().validate(self, groups *)

    val validationViolation = constraintViolation.stream()
      .map(violation => {
        val descriptor = violation.getConstraintDescriptor
        val annotation = descriptor.getAnnotation

        val aClass = TypeResolver.resolve(annotation.annotationType)
        val method = aClass.findMethod("property")

        val path = new util.ArrayList[AnyRef]()

        if (method == null)
          violation.getPropertyPath.forEach(node => path.add(node.getName))
        else {
          val invoked = method.invoke(annotation)
          path.add(invoked.asInstanceOf[AnyRef])
        }

        new ValidationViolation(path, violation.getMessage, violation.getRootBeanClass)
      })
      .toList

    if (!validationViolation.isEmpty) {
      throw new ValidationException(validationViolation)
    }
  }

  def sessionFactory: Stage.SessionFactory = {
    CDI.current().select(classOf[Stage.SessionFactory]).get()
  }


}
