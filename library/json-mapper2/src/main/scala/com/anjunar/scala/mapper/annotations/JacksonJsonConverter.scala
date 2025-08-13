package com.anjunar.scala.mapper.annotations

trait JacksonJsonConverter {

  def toJava(value : Any) : Any

  def toJson(value : Any) : String

}
