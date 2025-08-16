package com.anjunar.vertx.fsm.services

import io.vertx.core.Future
import io.vertx.ext.web.RoutingContext

trait JsonFSMService[E] extends FSMService {

  def run(ctx : RoutingContext, entity : E) : Future[E]

}
