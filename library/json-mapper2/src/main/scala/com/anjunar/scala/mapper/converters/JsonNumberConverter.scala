package com.anjunar.scala.mapper.converters

import com.anjunar.scala.mapper.JsonContext
import com.anjunar.scala.mapper.intermediate.model.{JsonNode, JsonNumber}
import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}

import java.util.concurrent.{CompletableFuture, CompletionStage}

class JsonNumberConverter extends JsonAbstractConverter(TypeResolver.resolve(classOf[Number])) {
  
  override def toJson(instance: Any, aType: ResolvedClass, context: JsonContext): JsonNode = JsonNumber(instance.toString)

  override def toJava(jsonNode: JsonNode, instance: Any, aType: ResolvedClass, context: JsonContext): CompletionStage[Any] = aType.raw match
    case bigDecimal if bigDecimal == classOf[java.math.BigDecimal] =>
      val constructor = bigDecimal.getConstructor(classOf[String])
      CompletableFuture.completedFuture(constructor.newInstance(jsonNode.value))
    case bigInteger if bigInteger == classOf[java.math.BigInteger] =>
      val constructor = bigInteger.getConstructor(classOf[String])
      CompletableFuture.completedFuture(constructor.newInstance(jsonNode.value))
    case _ =>
      val method = aType.findDeclaredMethod("valueOf", classOf[String])
      CompletableFuture.completedFuture(method.invoke(null, jsonNode.value))
}
