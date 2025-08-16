package com.anjunar.vertx.webauthn

import com.anjunar.scala.mapper.annotations.JacksonJsonConverter
import com.webauthn4j.converter
import com.webauthn4j.converter.util.ObjectConverter
import com.webauthn4j.data.attestation.AttestationObject

class AttestationObjectConverter extends JacksonJsonConverter {
  private val objectMapper = new ObjectConverter()
  private val authenticatorObjectConverter = new converter.AttestationObjectConverter(objectMapper)

  override def toJava(value: Any): Any = authenticatorObjectConverter.convert(value.asInstanceOf[String])

  override def toJson(value: Any): String = authenticatorObjectConverter.convertToBase64urlString(value.asInstanceOf[AttestationObject])
}
