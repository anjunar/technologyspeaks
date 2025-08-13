package com.anjunar.scala.mapper.intermediate.model

import scala.collection.mutable

case class JsonObject(value : mutable.Map[String, JsonNode]) extends JsonNode
