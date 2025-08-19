package com.anjunar.vertx.jaxrs

import com.anjunar.scala.universe.ResolvedClass
import com.anjunar.scala.universe.members.ResolvedMethod
import com.anjunar.vertx.fsm.StateDef
import io.vertx.core.Future
import io.vertx.ext.web.RoutingContext

import java.lang.annotation.Annotation
import java.lang.reflect.Type

trait ParamReader {
  
  def canRead(ctx: RoutingContext, javaType: ResolvedClass, annotations: Array[Annotation]): Boolean
  
  def read(ctx: RoutingContext, javaType: ResolvedClass, annotations: Array[Annotation], state: StateDef): Future[Any]

}
