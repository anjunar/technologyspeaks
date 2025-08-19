package com.anjunar.vertx.fsm

import scala.collection.mutable

case class FSMBuilder(transitions : mutable.Map[StateDef, Seq[StateDef]] = mutable.HashMap[StateDef, Seq[StateDef]]()) {
  
  def transition(value : StateDef, transition : StateDef => Seq[StateDef]) : StateDef = {
    transitions.put(value, transition(value))
    value
  }

}
