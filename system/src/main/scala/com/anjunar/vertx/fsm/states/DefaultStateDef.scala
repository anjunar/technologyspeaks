package com.anjunar.vertx.fsm.states

import com.anjunar.vertx.engine.SchemaView.Full
import com.anjunar.vertx.engine.SchemaView
import com.anjunar.vertx.fsm.services.DefaultFSMService

case class DefaultStateDef(name : String, 
                           url : String,
                           method : String = "GET",
                           contentType : String = "application/json",
                           view : SchemaView = Full, 
                           entity : Class[?], 
                           service : Class[? <: DefaultFSMService[?]]) 
  extends StateDef[DefaultFSMService[?]]
