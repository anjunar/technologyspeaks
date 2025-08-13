package com.anjunar.olama.json

import com.fasterxml.jackson.annotation.JsonProperty

case class JsonObject(@JsonProperty("type")
                      nodeType: NodeType = NodeType.OBJECT,
                      description: String = null,
                      properties: Map[String, Node],
                      required: Set[String] = null) extends Node