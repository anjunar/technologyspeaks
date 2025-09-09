package com.anjunar.vertx.engine

import java.util.concurrent.CompletionStage

trait VisibilityRule[E] {
  def isVisible(entity: E, property: String, ctx: RequestContext): CompletionStage[Boolean]

  def isWriteable(entity: E, property: String, ctx: RequestContext): CompletionStage[Boolean]
}
