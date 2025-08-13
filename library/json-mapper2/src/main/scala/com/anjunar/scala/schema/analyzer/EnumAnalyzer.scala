package com.anjunar.scala.schema.analyzer

import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}

class EnumAnalyzer extends AbstractAnalyzer {

  override def analyze(aClass: ResolvedClass): Boolean = aClass <:< TypeResolver.resolve(classOf[Enum[?]])
  
}
