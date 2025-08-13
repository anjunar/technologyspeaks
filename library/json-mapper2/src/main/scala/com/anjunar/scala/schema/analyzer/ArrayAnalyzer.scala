package com.anjunar.scala.schema.analyzer

import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}

class ArrayAnalyzer extends AbstractAnalyzer {

  override def analyze(aClass: ResolvedClass): Boolean = aClass.raw.isArray

}
