package com.anjunar.vertx.webauthn

import com.anjunar.configuration.ObjectMapperContextResolver
import com.anjunar.scala.mapper.annotations.JacksonJsonConverter
import com.webauthn4j.converter.util.ObjectConverter
import com.webauthn4j.data.client.CollectedClientData

class CollectedClientDataConverter extends JacksonJsonConverter {

  private val objectMapper = new ObjectConverter()

  override def toJava(value: Any): Any = objectMapper.getJsonConverter.readValue(value.toString, classOf[CollectedClientData])

  override def toJson(value: Any): String = objectMapper.getJsonConverter.writeValueAsString(value)
  
}
