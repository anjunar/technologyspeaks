package com.anjunar.olama

import com.anjunar.olama.json.{JsonFunction, JsonNode, Node}

import java.util

case class ChatRequest(model: String = "gemma3",
                       messages: Seq[ChatMessage],
                       tools: Seq[JsonFunction] = null,
                       format: Node = null,
                       stream: Boolean = true,
                       options: RequestOptions = RequestOptions(),
                       keepAlive: String = null)