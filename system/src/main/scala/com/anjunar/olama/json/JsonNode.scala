package com.anjunar.olama.json

import com.fasterxml.jackson.annotation.JsonProperty

import scala.beans.BeanProperty
import scala.compiletime.uninitialized

case class JsonNode(@JsonProperty("type")
                    nodeType: NodeType,
                    description: String = null) extends Node

