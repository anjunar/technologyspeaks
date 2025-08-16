package com.anjunar.scala.schema.engine

case class RequestContext(currentUser: User, roles: Set[String])
