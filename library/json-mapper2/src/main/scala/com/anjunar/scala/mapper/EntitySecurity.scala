package com.anjunar.scala.mapper
import com.anjunar.scala.mapper.exceptions.{ValidationException, ValidationViolation}
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

import java.lang.annotation.Annotation
import java.util
import scala.collection.mutable
import scala.collection.mutable.ListBuffer
import scala.compiletime.uninitialized
import scala.jdk.CollectionConverters.*

@ApplicationScoped
class EntitySecurity {

  def checkRestrictionAndViolations(annotations: Array[Annotation], context: Context, value: AnyRef) = {
    val path = new util.ArrayList[AnyRef]()

    val violations: ListBuffer[ValidationViolation] = new ListBuffer[ValidationViolation]()

    traverseContext(context, path, (path, context) => {
      violations.addAll(extractViolations(context, path))
    })

    if (violations.isEmpty) {
      value
    } else {
      throw new ValidationException(violations.asJava)
    }
  }

  def traverseContext(context: Context, path: util.List[AnyRef], callback: (util.List[AnyRef], Context) => Unit): Unit = {
    callback(path, context)
    context.children.foreach(entry => {
      val paths = new util.ArrayList[AnyRef](path)
      paths.add(entry._1)
      traverseContext(entry._2, paths, callback)
    })
  }

  def extractViolations(context: Context, path: util.List[AnyRef]): mutable.Set[ValidationViolation] = {
    context
      .violations
      .asScala
      .map(violation => {
        val newPath = util.ArrayList[AnyRef](path)
        newPath.add(violation.getPropertyPath.toString)
        new ValidationViolation(newPath, violation.getMessage, violation.getRootBeanClass.getSimpleName)
      })
  }
}
