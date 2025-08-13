package com.anjunar.scala.mapper.intermediate.parser

import com.anjunar.scala.mapper.intermediate.model.*
import org.apache.commons.text.StringEscapeUtils

import java.util
import java.util.Objects
import scala.collection.mutable
import scala.collection.mutable.ListBuffer
import scala.util.control.Breaks
import scala.util.control.Breaks.{break, breakable}

object Parser {

  def parse(iterator: util.ListIterator[Value]): JsonNode = {
    if (iterator.hasNext) {
      val token = iterator.next
      token.aType match {
        case "objectStart" => JsonObject(parseObject(iterator))
        case "arrayStart" => JsonArray(parseArray(iterator))
        case "string" => JsonString(StringEscapeUtils.unescapeJson(token.value))
        case "number" => JsonNumber(token.value)
        case "boolean" => JsonBoolean(token.value == "true")
        case "null" => new JsonNull
        case _ => throw new IllegalStateException("unknown type " + token.aType)
      }
    } else {
      JsonObject(parseObject(iterator))
    }
  }

  private def parseObject(iterator: util.ListIterator[Value]) = {
    val result = new mutable.LinkedHashMap[String, JsonNode]
    breakable(while (iterator.hasNext) {
      var token = iterator.next
      if (iterator.hasNext) {
        if (token.aType == "objectEnd") break
        else {
          val jsonNode = parseProperty(iterator)
          if (Objects.nonNull(jsonNode)) result.put(token.value, jsonNode)
        }
        if (!iterator.hasNext) break
        token = iterator.next
        if (token.aType == "objectEnd") break
        if (!(token.aType == "comma")) throw new IllegalStateException("Comma Expected or Object End")
      }
    })
    result
  }

  private def parseArray(iterator: util.ListIterator[Value]) = {
    val result = new ListBuffer[JsonNode]
    breakable (while (iterator.hasNext) {
      var token = iterator.next
      if (token.aType == "arrayEnd") break
      else {
        token = iterator.previous
        result.append(parse(iterator))
        token = iterator.next
        if (token.aType == "arrayEnd") break
        if (!(token.aType == "comma")) throw new IllegalStateException("Comma expected")
      }
    })
    result
  }

  private def parseProperty(iterator: util.ListIterator[Value]): JsonNode = {
    val token = iterator.next
    if (token.aType == "objectEnd") return null
    if (token.aType == "colon") return parse(iterator)
    throw new IllegalStateException("Colon Expected")
  }


}
