package com.anjunar.scala.mapper.converters

import com.anjunar.scala.mapper.{IdProvider, JsonContext, UploadedFile}
import com.anjunar.scala.mapper.intermediate.model.{JsonArray, JsonNode, JsonObject}
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

  override def toJava(jsonNode: JsonNode, instance: Any, aType: ResolvedClass, context: JsonContext): CompletionStage[Any] = jsonNode match
    case array : JsonArray =>

      val collection: util.Collection[Any] = aType.raw match
        case set if classOf[util.Set[?]].isAssignableFrom(set) => new util.HashSet[Any]()
        case list if classOf[util.List[?]].isAssignableFrom(list) => new util.ArrayList[Any]()

      val registry = context.registry
      val converter = registry.find(aType.typeArguments.head)
      
      val javaCollection = instance.asInstanceOf[util.Collection[IdProvider]]

      var index = 0
      
      val futures = array.value.map(node => {
        val newContext = JsonContext(context, index, context.noValidation, context.schema, context)
        val result = converter.toJava(node, javaCollection.asScala.find(elem => {
          val option = node.asInstanceOf[JsonObject].value.get("id")
          if (option.isEmpty) {
            false
          } else {
            elem.id.toString == option.get.value.toString
          }
        }).orNull, aType.typeArguments.head, newContext).toCompletableFuture

        index = index + 1
        result
      })
      
      CompletableFuture.allOf(futures.toArray*)
        .thenApply(_ => {
          futures.foreach(future => {
            collection.add(future.join())
          })
          collection
        })
      
    case _ => throw IllegalStateException("No JsonArray")
}
