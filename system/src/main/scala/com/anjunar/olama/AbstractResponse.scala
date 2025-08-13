package com.anjunar.olama

import com.fasterxml.jackson.annotation.JsonProperty

import java.time.LocalDateTime
import scala.beans.BeanProperty
import scala.compiletime.uninitialized

class AbstractResponse {

  var model: String = uninitialized

  @JsonProperty("created_at")
  var createdAt : LocalDateTime = uninitialized

  @JsonProperty("total_duration")
  var totalDuration: Long = uninitialized

  @JsonProperty("load_duration")
  var loadDuration: Long = uninitialized

  @JsonProperty("prompt_eval_count")
  var promptEvalCount: Long = uninitialized

  @JsonProperty("prompt_eval_duration")
  var promptEvalDuration: Long = uninitialized

  @JsonProperty("eval_count")
  var evalCount: Long = uninitialized

  @JsonProperty("eval_duration")
  var evalDuration: Long = uninitialized

  @JsonProperty("done_reason")
  var doneReason: String = uninitialized

  var done: Boolean = uninitialized

}
