package com.anjunar.jpa

import com.anjunar.scala.mapper.IdProvider
import com.anjunar.scala.mapper.exceptions.{ValidationException, ValidationViolation}
import com.anjunar.scala.universe.TypeResolver
import jakarta.enterprise.inject.spi.CDI
import jakarta.inject.Inject
import jakarta.persistence.Transient
import jakarta.validation.Validator
import org.hibernate.reactive.stage.Stage

import java.util
import java.util.concurrent.CompletionStage
import scala.compiletime.uninitialized

trait EntityContext[E <: EntityContext[E]] extends IdProvider {
  self: E =>

  @Inject
  @Transient  
  var validator : Validator = uninitialized

  def persist()(implicit session : Stage.Session): CompletionStage[Void] = {
    session.persist(self)
  }

  def merge()(implicit session : Stage.Session): CompletionStage[E] = {
    session.merge(self)
  }

  def delete()(implicit session : Stage.Session): CompletionStage[Void] = {
    session.remove(self)
  }

  def validate(groups: Class[?]*): Unit = {
    val constraintViolation = validator.validate(self, groups *)

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

        new ValidationViolation(path, violation.getMessage, violation.getRootBeanClass.getSimpleName)
      })
      .toList

    if (!validationViolation.isEmpty) {
      throw new ValidationException(validationViolation)
    }
  }

}
