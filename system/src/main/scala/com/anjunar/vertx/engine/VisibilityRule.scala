package com.anjunar.vertx.engine

import org.hibernate.reactive.stage.Stage

import java.util.concurrent.CompletionStage

trait VisibilityRule[E] {
  def isVisible(entity: E, property: String, ctx: RequestContext, factory : Stage.Session): CompletionStage[Boolean]

  def isWriteable(entity: E, property: String, ctx: RequestContext, factory : Stage.Session): CompletionStage[Boolean]
}
