package com.anjunar.scala.mapper

import com.anjunar.scala.mapper.converters.*
import com.anjunar.scala.universe.ResolvedClass

class JsonConverterRegistry {
  
  val converters: Array[JsonAbstractConverter] = Array(
    new JsonArrayConverter,
    new JsonBooleanConverter,
    new JsonByteConverter,
    new JsonEnumConverter,
    new JsonLocaleConverter,
    new JsonMapConverter,
    new JsonNumberConverter,
    new JsonStringConverter,
    new JsonTemporalAmountConverter,
    new JsonTemporalConverter,
    new JsonUUIDConverter,
    new JsonBeanConverter
  )

  def find(aClass : ResolvedClass): JsonAbstractConverter = converters.find(converter => {
    aClass <:< converter.aClass
  }).orNull

}
