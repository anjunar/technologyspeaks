package com.anjunar.vertx.engine

import com.anjunar.scala.introspector.DescriptionIntrospector
import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import org.hibernate.reactive.stage.Stage

import java.util.concurrent.CompletableFuture

case class DefaultRule[E]() extends VisibilityRule[E] {
  override def isVisible(entity: E, property: String, ctx: RequestContext, factory : Stage.SessionFactory) = CompletableFuture.completedFuture(true)

  override def isWriteable(entity: E, property: String, ctx: RequestContext, factory : Stage.SessionFactory) = {
    val model = DescriptionIntrospector.createWithType(entity.getClass)
    val prop = model.findProperty(property)
    val propertyDescriptor = prop.findAnnotation(classOf[PropertyDescriptor])
    CompletableFuture.completedFuture(propertyDescriptor.writeable())
  }
}
