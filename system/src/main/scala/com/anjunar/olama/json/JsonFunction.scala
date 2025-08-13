package com.anjunar.olama.json

import com.fasterxml.jackson.annotation.JsonProperty

case class JsonFunction(@JsonProperty("type")
                        nodeType: NodeType = NodeType.FUNCTION,
                        description: String,
                        function: JsonFunctionBody) extends Node