package com.anjunar.vertx.jaxrs

import com.anjunar.scala.universe.members.ResolvedMethod
import com.anjunar.vertx.fsm.StateDef
import io.vertx.core.Future
import io.vertx.ext.web.RoutingContext

import java.lang.annotation.Annotation
import java.lang.reflect.Type

trait MessageBodyWriter {

  def canWrite(entity : Any, javaType : Type, annotations : Array[Annotation], ctx : RoutingContext, state : StateDef, transitions : Seq[StateDef]) : Boolean
  
  def write(entity : Any, javaType : Type, annotations : Array[Annotation], ctx : RoutingContext, state : StateDef, transitions : Seq[StateDef]) : Future[String]

}
