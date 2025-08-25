package com.anjunar.scala.mapper

import com.anjunar.scala.mapper.intermediate.generator.JsonGenerator
import com.anjunar.scala.mapper.intermediate.model.{JsonNode, JsonObject}
import com.anjunar.scala.mapper.intermediate.parser.{Parser, Tokenizer}
import com.anjunar.scala.schema.builder.EntitySchemaBuilder
import com.anjunar.scala.schema.model.validators.SizeValidator
import com.anjunar.scala.schema.model.*
import com.anjunar.scala.universe.ResolvedClass

import java.util.concurrent.{CompletableFuture, CompletionStage}

class JsonMapper {

  val registry = new JsonConverterRegistry

  def toJsonObjectForJson(jsonObject: JsonObject): CompletionStage[String] = {
    CompletableFuture.supplyAsync(() => {
      JsonGenerator.generate(jsonObject)
    })
  }

  def toJson(entity: AnyRef, aType: ResolvedClass, context: JsonContext): CompletionStage[JsonObject] = {
    CompletableFuture.supplyAsync(() => {
      val converter = registry.find(aType)
      val jsonObject = converter.toJson(entity, aType, context).asInstanceOf[JsonObject]
      jsonObject
    })
  }

  def toJava(jsonNode: JsonNode, aType : ResolvedClass, context: JsonContext): CompletionStage[AnyRef] = {
    val converter = registry.find(aType)
    converter.toJava(jsonNode, aType, context).asInstanceOf[CompletionStage[AnyRef]]
  }

  def toJsonObjectForJava(value: String) : CompletionStage[JsonObject] = {
    CompletableFuture.supplyAsync(() => {
      val tokens = Tokenizer.tokenize(value)
      Parser.parse(tokens.listIterator()).asInstanceOf[JsonObject]
    })
  }
}
