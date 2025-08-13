package com.anjunar.jpa

import com.anjunar.scala.mapper.IdProvider
import com.anjunar.scala.mapper.exceptions.{ValidationException, ValidationViolation}
import com.anjunar.scala.universe.TypeResolver
import jakarta.enterprise.inject.spi.CDI
import jakarta.persistence.EntityManager
import jakarta.validation.Validator

import java.util

trait EntityContext[E <: EntityContext[E]] extends IdProvider { self: E =>

  def saveOrUpdate(): E = {
    val managed = if (version == null || version == 0) {
      entityManager.persist(this)
      return this
    } else {
      if (entityManager.contains(this)) {
        this
      } else {
        entityManager.merge(this)
      }
    }

    CDI.current().getBeanContainer.getEvent.select(new SaveLiteral).fire(managed)

    managed
  }

  def delete(): Unit = {
    entityManager.remove(this)
    CDI.current().getBeanContainer.getEvent.select(new DeleteLiteral).fire(this)
  }

  def detach(): Unit = {
    entityManager.detach(this)
  }

  def validate(groups: Class[?]*): Unit = {
    val constraintViolation = CDI.current().select(classOf[Validator]).get().validate(this, groups *)

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

  def isPersistent: Boolean = entityManager.contains(this)

  def entityManager: EntityManager = {
    CDI.current().select(classOf[EntityManager]).get()
  }


}
