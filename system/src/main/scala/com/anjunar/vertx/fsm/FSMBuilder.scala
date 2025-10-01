package com.anjunar.vertx.fsm

import scala.collection.mutable

case class FSMBuilder(transitions : mutable.Map[StateDef[?], Seq[StateDef[?]]] = mutable.HashMap[StateDef[?], Seq[StateDef[?]]]()) {
  
  def transition[E](value : StateDef[E], transition : StateDef[E] => Seq[StateDef[?]]) : StateDef[E] = {
    transitions.put(value, transition(value))
    value
  }

}
