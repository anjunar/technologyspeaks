package com.anjunar.vertx.fsm.services

trait DefaultFSMService[E] extends FSMService {

  def run(callback: E => Unit): Unit

}
