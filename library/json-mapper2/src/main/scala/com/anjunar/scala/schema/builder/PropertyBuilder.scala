package com.anjunar.scala.schema.builder

import com.anjunar.scala.introspector.DescriptionIntrospector
import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.scala.schema.model.Link
import com.anjunar.scala.universe.introspector.{AbstractProperty, BeanIntrospector, BeanProperty}

import java.lang.reflect.Type
import java.time.{Duration, LocalDate, LocalDateTime, LocalTime}
import java.util
import java.util.{Optional, UUID}
import scala.collection.mutable
import scala.compiletime.uninitialized

class PropertyBuilder[C](val name : String, val aClass : Type, isTable : Boolean, parent : SchemaBuilder) {

  var schemaBuilder: SchemaBuilder = new SchemaBuilder(isTable, parent)

  val property: AbstractProperty = {
    val model = DescriptionIntrospector.createWithType(aClass)
    val beanProperty = model.findProperty(name)
    
    if (beanProperty == null) {
      throw new IllegalStateException(s"Property $name not fount on Class ${aClass.getTypeName}")
    }
    
    beanProperty
  }

  val annotation: PropertyDescriptor = {
    property.findDeclaredAnnotation(classOf[PropertyDescriptor])
  }

  var widget : String = {
    if (annotation != null && annotation.widget().nonEmpty) {
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

  var title : String = {
    if (annotation == null) {
      ""
    } else {
      annotation.title()
    }
  }

  var description : String = {
    if (annotation == null) {
      ""
    } else {
      annotation.description()
    }
  }

  var id: Boolean = {
    if (annotation == null) {
      false
    } else {
      annotation.id()
    }
  }

  var naming: Boolean = {
    if (annotation == null) {
      false
    } else {
      annotation.naming()
    }
  }

  var writeable: Boolean = {
    if (annotation == null) {
      false
    } else {
      annotation.writeable()
    }
  }

  var hidden: Boolean = {
    if (annotation == null) {
      false
    } else {
      annotation.hidden()
    }
  }

  var step: String = {
    if (annotation == null) {
      ""
    } else {
      annotation.step()
    }
  }

  var visible: Boolean = true

  var secured : Boolean = false

  val links = new mutable.LinkedHashMap[String, Link]

  def withLinks(link: LinkContext => Unit): PropertyBuilder[C] = {
    link((name: String, link: Link) => links.put(name, link))
    this
  }

  def withTitle(value : String): PropertyBuilder[C] = {
    title = value
    this
  }

  def withDescription(value : String): PropertyBuilder[C] = {
    description = value
    this
  }

  def withWidget(value : String): PropertyBuilder[C] = {
    widget = value
    this
  }

  def withId(value : Boolean): PropertyBuilder[C] = {
    id = value
    this
  }

  def withNaming(value : Boolean): PropertyBuilder[C] = {
    naming = value
    this
  }

  def withWriteable(value : Boolean): PropertyBuilder[C] = {
    writeable = value
    this
  }

  def withHidden(value : Boolean): PropertyBuilder[C] = {
    hidden = value
    this
  }

  def withStep(value : String) : PropertyBuilder[C] = {
    step = value
    this
  }

  def withManaged(value : String => (Boolean, UUID), link : (UUID, LinkContext) => Unit) : PropertyBuilder[C] = {
    val (isVisible, id) = value(name)

    if (id != null) {
      link(id, (name: String, link: Link) => links.put(name, link))
    }

    visible = isVisible
    secured = true

    this
  }

  def forType[D](aClass: Class[D], builder: EntitySchemaBuilder[D] => Unit): PropertyBuilder[C] = {
    schemaBuilder.forType(aClass, builder)
    this
  }

  def forInstance[D](instance : util.Collection[D], aClass : Class[D], builder: D => EntitySchemaBuilder[D] => Unit) : PropertyBuilder[C] = {
    schemaBuilder.table = true
    instance.forEach(instance => schemaBuilder.forInstance(instance, aClass, builder(instance)))
    this
  }
  
  def forTuple(builder: TupleSchemaBuilder => Unit) : PropertyBuilder[C] = {
    schemaBuilder.forTuple(builder)
    this
  }

}
