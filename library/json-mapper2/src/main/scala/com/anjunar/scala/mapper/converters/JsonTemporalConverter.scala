package com.anjunar.scala.mapper.converters

import com.anjunar.scala.mapper.JsonContext
import com.anjunar.scala.mapper.intermediate.model.{JsonNode, JsonString}
import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}

import java.time.format.DateTimeFormatter
import java.time.temporal.{ChronoUnit, Temporal}
import java.time.{LocalDate, LocalDateTime, LocalTime}

class JsonTemporalConverter extends JsonAbstractConverter(TypeResolver.resolve(classOf[Temporal])) {

  override def toJson(instance: Any, aType: ResolvedClass, context: JsonContext): JsonNode = instance match
    case localDate : LocalDate => JsonString(localDate.format(DateTimeFormatter.ISO_LOCAL_DATE))
    case localDateTime : LocalDateTime => JsonString(localDateTime.truncatedTo(ChronoUnit.MINUTES).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
    case localTime : LocalTime  => JsonString(localTime.truncatedTo(ChronoUnit.MINUTES).format(DateTimeFormatter.ISO_TIME))
    case _ => throw new IllegalStateException(s"Unhandled time object ${instance}")
  
  override def toJava(jsonNode: JsonNode, aType: ResolvedClass, context: JsonContext): Any = {
    val method = aType.findDeclaredMethod("parse", classOf[CharSequence])
    method.invoke(null, jsonNode.value)
  }
  
}
