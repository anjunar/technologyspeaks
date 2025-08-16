package com.anjunar.vertx.fsm.services

trait TableFSMService[S, E] extends FSMService {

  def search(callback: S => Unit): Unit
  
  def list(callback: E => Unit) : Unit

}
