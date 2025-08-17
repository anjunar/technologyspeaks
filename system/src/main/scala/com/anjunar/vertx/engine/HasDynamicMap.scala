package com.anjunar.vertx.engine

trait HasDynamicMap {
  def dynamicMap: Map[String, Map[String, Any]]

  def attributeRule: AttributeVisibilityRule
}
