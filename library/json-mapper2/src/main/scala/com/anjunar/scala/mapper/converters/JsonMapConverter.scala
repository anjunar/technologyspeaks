package com.anjunar.scala.mapper.converters

import com.anjunar.scala.mapper.JsonContext
import com.anjunar.scala.mapper.intermediate.model.{JsonNode, JsonObject}
import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}

import java.util
import java.util.concurrent.CompletionStage
import scala.collection.mutable
import scala.jdk.CollectionConverters.*

class JsonMapConverter extends JsonAbstractConverter(TypeResolver.resolve(classOf[util.Map[Any, Any]])) {

  override def toJson(instance: Any, aType: ResolvedClass, context: JsonContext): JsonNode = instance match
    case map: util.Map[String, Any] =>
      JsonObject(
        mutable.LinkedHashMap.from(map
          .asScala
          .map(item => {
            val registry = context.registry
            val valueConverter = registry.find(aType.typeArguments(1))

            (item._1, valueConverter.toJson(item._2, TypeResolver.resolve(item._2.getClass), context))
          }))
          
      )

    case _ => throw new IllegalStateException("No Collection")


  override def toJava(jsonNode: JsonNode, instance: Any, aType: ResolvedClass, context: JsonContext): CompletionStage[Any] = ???
}
