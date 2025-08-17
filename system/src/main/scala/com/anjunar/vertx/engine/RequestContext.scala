package com.anjunar.vertx.engine

import io.vertx.ext.auth.User

case class RequestContext(currentUser: User, roles: Set[String])
