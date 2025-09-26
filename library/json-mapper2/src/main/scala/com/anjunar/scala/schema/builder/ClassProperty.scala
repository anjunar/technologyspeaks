package com.anjunar.scala.schema.builder

import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.scala.schema.model.Link
import com.anjunar.scala.universe.introspector.AbstractProperty
import scala.jdk.CollectionConverters.*
import java.util

case class ClassProperty(property : AbstractProperty,
                         writable : Boolean,
                         visible : Boolean,
                         schemas : Schemas,
                         links : Seq[Link],
                         annotation : PropertyDescriptor) {
  
  val getLinks : util.Map[String, Link] = {
    links.map(link => link.rel -> link).toMap.asJava
  }
  
  val secured = false
  
}


