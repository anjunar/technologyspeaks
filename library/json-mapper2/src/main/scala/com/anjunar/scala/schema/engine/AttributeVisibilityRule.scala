package com.anjunar.scala.schema.engine

trait AttributeVisibilityRule {
  def isVisible(entity: HasDynamicMap, key: String, ctx: RequestContext): Boolean
}
