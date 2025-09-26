package com.anjunar.scala.schema.builder

import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.scala.schema.model.Link
import com.anjunar.scala.universe.introspector.AbstractProperty

import java.time.{Duration, LocalDate, LocalDateTime, LocalTime}
import scala.jdk.CollectionConverters.*
import java.util
import java.util.UUID

case class ClassProperty(property : AbstractProperty,
                         writeable : Boolean,
                         visible : Boolean,
                         schemas : Schemas,
                         links : Seq[Link],
                         private val annotation : PropertyDescriptor) {
  
  val getLinks : util.Map[String, Link] = {
    links.map(link => link.rel -> link).toMap.asJava
  }
  
  val secured = false

  def title: String = annotation.title()

  def description: String = annotation.description()

  def widget: String = {
    if (annotation.widget().nonEmpty) {
      annotation.widget()
    } else {
      property.propertyType.raw match
        case aClass if classOf[util.Collection[?]].isAssignableFrom(aClass) => "lazy-multi-select"
        case aClass if classOf[java.lang.Boolean].isAssignableFrom(aClass) => "checkbox"
        case aClass if classOf[Enum[?]].isAssignableFrom(aClass) => "select"
        case aClass if classOf[Number].isAssignableFrom(aClass) => "number"
        case aClass if classOf[String].isAssignableFrom(aClass) => "text"
        case aClass if classOf[LocalDateTime].isAssignableFrom(aClass) => "datetime-local"
        case aClass if classOf[LocalDate].isAssignableFrom(aClass) => "date"
        case aClass if classOf[LocalTime].isAssignableFrom(aClass) => "time"
        case aClass if classOf[Duration].isAssignableFrom(aClass) => "duration"
        case aClass if classOf[UUID].isAssignableFrom(aClass) => "text"
        case _ => "form"
    }
  }

  def step: String = annotation.step()

  def id: Boolean = annotation.id()

  def naming: Boolean = annotation.naming()

  def hidden: Boolean = annotation.hidden()

}


