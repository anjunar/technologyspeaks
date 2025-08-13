package com.anjunar.olama

import com.fasterxml.jackson.annotation.JsonProperty

import java.util

case class ChatMessage(role: ChatRole = ChatRole.USER,
                       content: String,
                       @JsonProperty("tool_calls")
                       toolCalls: util.List[ChatFunction] = null,
                       images: Array[String] = null) {
  
  def tokenSize : Int = content.split(" ").length
  
}