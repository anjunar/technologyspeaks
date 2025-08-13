package com.anjunar.olama

import com.anjunar.configuration.ObjectMapperContextResolver
import com.fasterxml.jackson.databind.ObjectMapper
import com.typesafe.scalalogging.Logger
import jakarta.ws.rs.client.{ClientRequestContext, ClientRequestFilter}
import jakarta.ws.rs.ext.Provider

import java.io.ByteArrayOutputStream
import java.nio.charset.StandardCharsets

@Provider
class LoggingRequestFilter extends ClientRequestFilter {

  val log: Logger = Logger[LoggingRequestFilter]

  override def filter(requestContext: ClientRequestContext): Unit = {

    val entity = requestContext.getEntity

    val mapper = ObjectMapperContextResolver.objectMapper

    log.info(requestContext.getUri.toASCIIString)
    log.info(mapper.writeValueAsString(entity))

  }
}
