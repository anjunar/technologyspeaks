package com.anjunar.vertx.webauthn

import com.anjunar.scala.mapper.annotations.JacksonJsonConverter
import com.fasterxml.jackson.core.`type`.TypeReference
import com.webauthn4j.converter.util.ObjectConverter
import com.webauthn4j.data.AuthenticatorTransport

import java.util

class AuthenticatorTransportConverter extends JacksonJsonConverter {
  private val objectMapper = new ObjectConverter()

  override def toJava(value: Any): Any = {
    objectMapper.getJsonConverter.readValue(value.toString, new TypeReference[util.Set[AuthenticatorTransport]] {})
  }

  override def toJson(value: Any): String = objectMapper.getJsonConverter.writeValueAsString(value)
}
