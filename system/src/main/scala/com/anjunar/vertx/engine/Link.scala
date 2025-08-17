package com.anjunar.vertx.engine

case class Link[E](rel: String, href: E => String, method : String, title : String)
