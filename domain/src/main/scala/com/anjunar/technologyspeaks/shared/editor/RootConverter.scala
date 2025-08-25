package com.anjunar.technologyspeaks.shared.editor

import com.anjunar.configuration.ObjectMapperContextResolver
import com.anjunar.scala.mapper.annotations.JacksonJsonConverter
import com.fasterxml.jackson.databind.{DeserializationFeature, ObjectMapper, SerializationFeature}
import jakarta.persistence.AttributeConverter

import java.util.concurrent.{CompletableFuture, CompletionStage}

class RootConverter extends JacksonJsonConverter {

  val objectMapper = ObjectMapperContextResolver.objectMapper
  
  override def toJava(value: Any): CompletionStage[Any] = CompletableFuture.completedFuture(objectMapper.readValue(value.toString, classOf[Root]))

  override def toJson(value: Any): String = objectMapper.writeValueAsString(value)

}
