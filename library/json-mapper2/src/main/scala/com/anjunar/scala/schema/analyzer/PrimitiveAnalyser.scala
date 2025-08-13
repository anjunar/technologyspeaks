package com.anjunar.scala.schema.analyzer

import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}

import java.lang.*
import java.time.temporal.{Temporal, TemporalAmount}
import java.util.{Locale, UUID}

class PrimitiveAnalyser extends AbstractAnalyzer {

  override def analyze(aClass: ResolvedClass): scala.Boolean = {
    aClass.raw.isPrimitive ||
    aClass <:< TypeResolver.resolve(classOf[UUID]) ||
      aClass <:< TypeResolver.resolve(classOf[Boolean]) ||
      aClass <:< TypeResolver.resolve(classOf[Byte])  ||
      aClass <:< TypeResolver.resolve(classOf[Locale]) ||
      aClass <:< TypeResolver.resolve(classOf[Number]) ||
      aClass <:< TypeResolver.resolve(classOf[String]) ||
      aClass <:< TypeResolver.resolve(classOf[TemporalAmount]) ||
      aClass <:< TypeResolver.resolve(classOf[Temporal]) ||
      aClass <:< TypeResolver.resolve(classOf[UUID]) 
  }
  
}
