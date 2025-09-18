package com.anjunar.vertx.engine

import com.anjunar.jaxrs.types.OwnerProvider
import com.anjunar.scala.introspector.DescriptionIntrospector
import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import org.hibernate.reactive.stage.Stage

import java.util.concurrent.{CompletableFuture, CompletionStage}

case class OwnerRule[E <: OwnerProvider]() extends VisibilityRule[E] {
  override def isVisible(entity: E, property: String, ctx: RequestContext, factory: Stage.SessionFactory): CompletionStage[Boolean] = CompletableFuture.completedFuture(true)

  override def isWriteable(entity: E, property: String, ctx: RequestContext, factory: Stage.SessionFactory): CompletionStage[Boolean] = {
    val model = DescriptionIntrospector.createWithType(entity.getClass)
    val prop = model.findProperty(property)
    val propertyDescriptor = prop.findAnnotation(classOf[PropertyDescriptor])

    if (propertyDescriptor.writeable()) {
      CompletableFuture.completedFuture(ctx.currentUser.get("id") == entity.owner.id.toString || ctx.roles.contains("Administrator"))
    } else {
      CompletableFuture.completedFuture(false)
    }
  }
}
