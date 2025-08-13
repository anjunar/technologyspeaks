package com.anjunar.scala.schema.analyzer

import com.anjunar.scala.universe.ResolvedClass

trait AbstractAnalyzer {
  
  def analyze(aClass : ResolvedClass) : Boolean
  
}
