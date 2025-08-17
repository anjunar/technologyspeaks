package com.anjunar.vertx.engine

case class DefaultRule[E]() extends VisibilityRule[E] {
  override def isVisible(entity: E, property: String, ctx: RequestContext) = true

  override def isWriteable(entity: E, property: String, ctx: RequestContext) = true
}
