package com.anjunar.scala.schema.analyzer

import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}

import java.util

class CollectionAnalyzer extends AbstractAnalyzer {

  override def analyze(aClass: ResolvedClass): Boolean = aClass <:< TypeResolver.resolve(classOf[util.Collection[?]])
  
}
