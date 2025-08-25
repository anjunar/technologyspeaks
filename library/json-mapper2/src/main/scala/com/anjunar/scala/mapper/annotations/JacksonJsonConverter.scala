package com.anjunar.scala.mapper.annotations

import java.util.concurrent.CompletionStage

trait JacksonJsonConverter {

  def toJava(value : Any) : CompletionStage[Any]

  def toJson(value : Any) : String

}
