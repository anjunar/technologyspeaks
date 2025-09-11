package com.anjunar.vertx.jaxrs.providers

import com.anjunar.scala.universe.ResolvedClass
import io.vertx.ext.web.RoutingContext

import java.lang.annotation.Annotation

trait ContextProvider {

  def canRead(javaType: ResolvedClass, annotations: Array[Annotation]): Boolean
  
  def read(javaType: ResolvedClass, annotations: Array[Annotation], ctx: RoutingContext): Any

}
