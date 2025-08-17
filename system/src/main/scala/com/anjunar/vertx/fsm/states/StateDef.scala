package com.anjunar.vertx.fsm.states

import com.anjunar.vertx.engine.SchemaView
import com.anjunar.vertx.fsm.services.FSMService

trait StateDef[S <: FSMService] {

  val name : String
  val url : String
  val method : String
  val view : SchemaView 
  val entity : Class[?] 
  val service : Class[? <: S]
  val contentType : String

}
