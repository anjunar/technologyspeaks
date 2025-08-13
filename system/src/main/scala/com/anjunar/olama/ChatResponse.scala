package com.anjunar.olama

import com.fasterxml.jackson.annotation.JsonProperty

import java.util
import scala.beans.BeanProperty
import scala.compiletime.uninitialized

class ChatResponse extends AbstractResponse {

  var message : ChatMessage = uninitialized

}
