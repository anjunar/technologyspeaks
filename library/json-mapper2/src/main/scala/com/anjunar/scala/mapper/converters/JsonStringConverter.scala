package com.anjunar.scala.mapper.converters

import com.anjunar.scala.mapper.JsonContext
import com.anjunar.scala.mapper.intermediate.model.{JsonNode, JsonString}
import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}

import java.util.concurrent.{CompletableFuture, CompletionStage}

class JsonStringConverter extends JsonAbstractConverter(TypeResolver.resolve(classOf[String])) {

  override def toJson(instance: Any, aType: ResolvedClass, context: JsonContext): JsonNode = JsonString(instance.asInstanceOf[String])

  override def toJava(jsonNode: JsonNode, instance: Any, aType: ResolvedClass, context: JsonContext): CompletionStage[Any] = CompletableFuture.completedFuture(jsonNode.value)
  
}
