package com.anjunar.vertx.jaxrs

import com.anjunar.scala.universe.members.ResolvedMethod
import com.anjunar.vertx.fsm.StateDef
import io.vertx.core.Future
import io.vertx.ext.web.RoutingContext

import java.lang.annotation.Annotation
import java.lang.reflect.Type

trait ParamReader {
  
  def canRead(ctx : RoutingContext, javaType : Type, annotations : Array[Annotation], method : ResolvedMethod) : Boolean
  
  def read(ctx : RoutingContext, javaType : Type, annotations : Array[Annotation], method : ResolvedMethod, state : StateDef) : Future[Any]

}
