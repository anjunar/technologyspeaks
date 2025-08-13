package com.anjunar.scala.schema.analyzer

import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}

class ObjectAnalyzer extends AbstractAnalyzer {

  override def analyze(aClass: ResolvedClass): Boolean = aClass <:< TypeResolver.resolve(classOf[AnyRef])
}
