package com.anjunar.vertx.fsm.services

import io.vertx.core.Future
import io.vertx.ext.web.RoutingContext

trait DefaultFSMService[E] extends FSMService {

  def run(event : RoutingContext): Future[E]

}
