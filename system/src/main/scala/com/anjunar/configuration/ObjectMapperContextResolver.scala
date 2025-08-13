package com.anjunar.configuration

import com.fasterxml.jackson.databind.{DeserializationFeature, ObjectMapper, SerializationFeature}
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.scala.DefaultScalaModule
import jakarta.ws.rs.ext.{ContextResolver, Provider}

object ObjectMapperContextResolver {

  val objectMapper: ObjectMapper = new ObjectMapper()
    .registerModule(new Jdk8Module().configureAbsentsAsNulls(true))
    .registerModule(new JavaTimeModule)
    .registerModule(DefaultScalaModule())
    .setSerializationInclusion(com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL)
    .configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false)
    .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)


}
