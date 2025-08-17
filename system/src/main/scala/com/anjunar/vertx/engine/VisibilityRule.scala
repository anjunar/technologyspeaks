package com.anjunar.vertx.engine

trait VisibilityRule[E] {
  def isVisible(entity: E, property: String, ctx: RequestContext): Boolean

  def isWriteable(entity: E, property: String, ctx: RequestContext): Boolean
}
