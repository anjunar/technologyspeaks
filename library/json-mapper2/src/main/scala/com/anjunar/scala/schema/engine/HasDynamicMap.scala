package com.anjunar.scala.schema.engine

trait HasDynamicMap {
  def dynamicMap: Map[String, Map[String, Any]]

  def attributeRule: AttributeVisibilityRule
}
