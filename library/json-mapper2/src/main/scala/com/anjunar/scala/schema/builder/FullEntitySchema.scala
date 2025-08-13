package com.anjunar.scala.schema.builder

import com.anjunar.scala.introspector.DescriptionIntrospector

import java.lang.reflect.Type

object FullEntitySchema {

  def analyse[C](builder : EntitySchemaBuilder[C], ignored : String*) : Unit = {
    val model = DescriptionIntrospector.createWithType(builder.aClass)
    model.properties.filter(property => ! ignored.contains(property.name)).foreach(property => {
      builder.property(property.name)
    })
  }

}
