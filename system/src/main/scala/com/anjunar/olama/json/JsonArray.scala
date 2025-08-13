package com.anjunar.olama.json

import com.fasterxml.jackson.annotation.JsonProperty

case class JsonArray(@JsonProperty("type")
                     nodeType: NodeType = NodeType.ARRAY,
                     description: String = null,
                     items: Node) extends Node