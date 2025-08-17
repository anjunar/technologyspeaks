package com.anjunar.vertx.engine

trait AttributeVisibilityRule {
  def isVisible(entity: HasDynamicMap, key: String, ctx: RequestContext): Boolean
}
