package com.anjunar.vertx.engine

import org.hibernate.reactive.stage.Stage

import java.util.concurrent.CompletableFuture

case class DefaultRule[E]() extends VisibilityRule[E] {
  override def isVisible(entity: E, property: String, ctx: RequestContext, session : Stage.Session) = CompletableFuture.completedFuture(true)

  override def isWriteable(entity: E, property: String, ctx: RequestContext, session : Stage.Session) = CompletableFuture.completedFuture(true)
}
