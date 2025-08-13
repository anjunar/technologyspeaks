package com.anjunar.scala.mapper

import com.anjunar.scala.mapper.converters.*
import com.anjunar.scala.universe.ResolvedClass

class MultipartFormConverterRegistry {
  
  val converters: Array[MultipartFormAbstractConverter] = Array(
    new MultipartFormBooleanConverter,
    new MultipartFormByteConverter,
    new MultipartFormCollectionConverter,
    new MultipartFormEnumConverter,
    new MultipartFormLocaleConverter,
    new MultipartFormNumberConverter,
    new MultipartFormStringConverter,
    new MultipartFormTemporalAmountConverter,
    new MultipartFormTemporalConverter,
    new MultipartFormUUIDConverter
  )

  def find(aClass : ResolvedClass): MultipartFormAbstractConverter = converters.find(converter => {
    aClass <:< converter.aClass
  }).orNull

}
