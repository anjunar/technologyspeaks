package com.anjunar.scala.mapper.intermediate.parser

import java.util
import java.util.ArrayList
import java.util.regex.Pattern
import scala.util.control.Breaks.{break, breakable}

object Tokenizer {

  private val tokens: Array[Token] = Array(
    Token("whitespace", Pattern.compile("""^\s+""")),
    Token("objectStart", Pattern.compile("""^(\{)""")),
    Token("objectEnd", Pattern.compile("""^(})""")),
    Token("arrayStart", Pattern.compile("""^(\[)""")),
    Token("arrayEnd", Pattern.compile("""^(])""")),
    Token("string", Pattern.compile("""^"((?:\\"|[^"])*+)"""")),
    Token("number", Pattern.compile("""^(-?\d[\d.e-]*)""")),
    Token("boolean", Pattern.compile("""^(true|false)""")),
    Token("null", Pattern.compile("""^(null)""")),
    Token("colon", Pattern.compile("""^(:)""")),
    Token("comma", Pattern.compile("""^(,)"""))
  )

  def tokenize(json: String): util.List[Value] = {
    var index = 0
    var oldIndex = 0
    val result = new util.ArrayList[Value]
    while (index < json.length) {
      oldIndex = index
      breakable(for (token <- tokens) {
        val substring = json.substring(index)
        val matcher = token.regex.matcher(substring)
        if (matcher.find)
          if (token.aType == "whitespace") {
            val end = matcher.end
            index += end
            break
          } else {
            val end = matcher.end
            val group = matcher.group(1)
            index += end
            result.add(Value(token.aType, group))
            break

          }
      })
      if (oldIndex == index) throw new IllegalStateException("Error a index " + index + " " + json.substring(index))
    }
    result
  }


}
