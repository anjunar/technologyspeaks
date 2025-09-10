package com.anjunar.vertx.engine

import com.anjunar.jaxrs.types.OwnerProvider
import org.hibernate.reactive.stage.Stage

import java.util.concurrent.{CompletableFuture, CompletionStage}

case class OwnerRule[E <: OwnerProvider]() extends VisibilityRule[E] {
  override def isVisible(entity: E, property: String, ctx: RequestContext, factory: Stage.SessionFactory): CompletionStage[Boolean] = CompletableFuture.completedFuture(true)

  override def isWriteable(entity: E, property: String, ctx: RequestContext, factory: Stage.SessionFactory): CompletionStage[Boolean] = {
    CompletableFuture.completedFuture(ctx.currentUser.get("id") == entity.owner.id.toString || ctx.roles.contains("Administrator"))
  }
}
