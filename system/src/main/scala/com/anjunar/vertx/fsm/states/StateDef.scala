package com.anjunar.vertx.fsm.states

import com.anjunar.scala.schema.engine.SchemaView
import com.anjunar.vertx.fsm.services.FSMService

trait StateDef[S <: FSMService] {

  val name : String
  val url : String
  val view : SchemaView 
  val entity : Class[?] 
  val service : Class[? <: S]

}
