package com.anjunar.scala.mapper.converters

import com.anjunar.scala.mapper.{JsonContext, UploadedFile}
import com.anjunar.scala.mapper.intermediate.model.{JsonArray, JsonNode}
import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}

import java.util
import java.util.concurrent.{CompletableFuture, CompletionStage}
import scala.jdk.CollectionConverters.*

class JsonArrayConverter extends JsonAbstractConverter(TypeResolver.resolve(classOf[util.Collection[?]])) {

  override def toJson(instance: Any, aType: ResolvedClass, context: JsonContext): JsonNode = instance match
    case collection: util.Collection[Any] =>
      JsonArray(
        collection.asScala.map(item => {
          val registry = context.registry
          val converter = registry.find(aType.typeArguments.head)
          converter.toJson(item, aType.typeArguments.head, context)
        })
      )
    case _ => throw new IllegalStateException("No Collection")

  override def toJava(jsonNode: JsonNode, aType: ResolvedClass, context: JsonContext): CompletionStage[Any] = jsonNode match
    case array : JsonArray =>

      val collection: util.Collection[Any] = aType.raw match
        case set if classOf[util.Set[?]].isAssignableFrom(set) => new util.HashSet[Any]()
        case list if classOf[util.List[?]].isAssignableFrom(list) => new util.ArrayList[Any]()

      val registry = context.registry
      val converter = registry.find(aType.typeArguments.head)

      val futures = array.value.map(node => converter.toJava(node, aType.typeArguments.head, context).toCompletableFuture)
      
      CompletableFuture.allOf(futures.toArray*)
        .thenApply(_ => {
          futures.foreach(future => {
            collection.add(future.join())
          })
          collection
        })
      
    case _ => throw IllegalStateException("No JsonArray")
}
