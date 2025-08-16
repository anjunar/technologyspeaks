package com.anjunar.scala.schema.engine

case class Link[E](rel: String, href: E => String, method : String, title : String)
