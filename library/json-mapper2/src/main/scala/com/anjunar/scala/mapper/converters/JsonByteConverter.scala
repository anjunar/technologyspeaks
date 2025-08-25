package com.anjunar.scala.mapper.converters

import com.anjunar.scala.mapper.JsonContext
import com.anjunar.scala.mapper.intermediate.model.{JsonNode, JsonString}
import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}

import java.util.Base64
import java.util.concurrent.{CompletableFuture, CompletionStage}

class JsonByteConverter extends JsonAbstractConverter(TypeResolver.resolve(classOf[Array[Byte]])) {

  override def toJson(instance: Any, aType: ResolvedClass, context: JsonContext): JsonNode = JsonString(Base64.getEncoder.encodeToString(instance.asInstanceOf[Array[Byte]]))

  override def toJava(jsonNode: JsonNode, aType: ResolvedClass, context: JsonContext): CompletionStage[Any] = CompletableFuture.completedFuture(Base64.getDecoder.decode(jsonNode.value.asInstanceOf[String].getBytes))
  
}
