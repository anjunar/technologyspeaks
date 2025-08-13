package com.anjunar.scala.mapper.intermediate.generator

import com.anjunar.scala.mapper.intermediate.model.*
import org.apache.commons.text.StringEscapeUtils

object JsonGenerator {

  def generate(jsonNode: JsonNode): String = jsonNode match {
    case jsonObject : JsonObject => 
      val properties: String = jsonObject.value.map (entry => s"\"${entry._1}\" : ${generate(entry._2)}").mkString(", ")
      s"{$properties}"

    case array : JsonArray => 
      val elements = array.value.map(element => generate(element)).mkString(", ")
      s"[${elements}]"

    case string : JsonString  => s"\"${StringEscapeUtils.escapeJson(string.value)}\""

    case number : JsonNumber => number.value

    case boolean : JsonBoolean => boolean.value.toString

    case aNull: JsonNull => "null"

    case _ => throw new IllegalStateException("Unexpected value: " + jsonNode)
  }


}
