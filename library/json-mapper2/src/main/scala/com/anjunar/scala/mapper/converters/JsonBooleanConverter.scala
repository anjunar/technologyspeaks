package com.anjunar.scala.mapper.converters

import com.anjunar.scala.mapper.JsonContext
import com.anjunar.scala.mapper.intermediate.model.{JsonBoolean, JsonNode}
import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}

import java.lang.Boolean
import java.util.concurrent.{CompletableFuture, CompletionStage}

class JsonBooleanConverter extends JsonAbstractConverter(TypeResolver.resolve(classOf[Boolean])) {

  override def toJson(instance: Any, aType: ResolvedClass, context: JsonContext): JsonNode = JsonBoolean(instance.asInstanceOf[Boolean])

  override def toJava(jsonObject: JsonNode, instance: Any, aType: ResolvedClass, context: JsonContext): CompletionStage[Any] = CompletableFuture.completedStage(jsonObject.value)
  
}
