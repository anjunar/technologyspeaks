package com.anjunar.vertx.fsm.states

import com.anjunar.scala.schema.engine.SchemaView
import com.anjunar.scala.schema.engine.SchemaView.Full
import com.anjunar.vertx.fsm.services.DefaultFSMService

case class DefaultStateDef(name : String, 
                           url : String, 
                           view : SchemaView = Full, 
                           entity : Class[?], 
                           service : Class[? <: DefaultFSMService[?]]) 
  extends StateDef[DefaultFSMService[?]]
