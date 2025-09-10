package com.anjunar.vertx.jaxrs

import com.anjunar.scala.universe.ResolvedClass
import com.anjunar.vertx.fsm.StateDef
import io.vertx.core.Future
import io.vertx.ext.web.RoutingContext
import org.hibernate.reactive.stage.Stage

import java.lang.annotation.Annotation
import java.util.concurrent.{CompletableFuture, CompletionStage}

trait MessageBodyWriter {
  
  val contentType : String

  def canWrite(entity: Any, javaType: ResolvedClass, annotations: Array[Annotation], ctx: RoutingContext, state: StateDef, transitions: Seq[StateDef]): Boolean

  def write(entity: Any, javaType: ResolvedClass, annotations: Array[Annotation], ctx: RoutingContext, state: StateDef, transitions: Seq[StateDef], factory : Stage.SessionFactory): CompletionStage[String]

}
