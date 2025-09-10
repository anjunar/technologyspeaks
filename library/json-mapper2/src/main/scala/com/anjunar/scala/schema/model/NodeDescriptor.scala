package com.anjunar.scala.schema.model

import com.anjunar.scala.mapper.annotations.{PropertyDescriptor, IgnoreFilter}
import com.anjunar.scala.schema.JsonDescriptorsGenerator
import com.anjunar.scala.schema.model.validators.Validator
import com.anjunar.scala.universe.TypeResolver

import java.util
import scala.beans.BeanProperty
import scala.compiletime.uninitialized

@IgnoreFilter
class NodeDescriptor {

  @PropertyDescriptor(title = "Title")
  var title: String = ""

  @PropertyDescriptor(title = "Description")
  var description: String = ""

  @PropertyDescriptor(title = "Widget")
  var widget: String = ""

  @PropertyDescriptor(title = "Identifier")
  var id: Boolean = false

  @PropertyDescriptor(title = "Named")
  var name: Boolean = false

  @PropertyDescriptor(title = "Hidden")
  var hidden : Boolean = false

  @PropertyDescriptor(title = "Type")
  var `type`: String = ""

  @PropertyDescriptor(title = "Step")
  var step : String = uninitialized

  @PropertyDescriptor(title = "Links")
  var links: util.Map[String, Link] = new util.LinkedHashMap[String, Link]()

  @PropertyDescriptor(title = "Validators")
  var validators : util.Map[String, Validator] = new util.HashMap[String, Validator]()

}

object NodeDescriptor {
  def apply(title: String, description: String, widget: String, id: Boolean, name: Boolean, hidden : Boolean, aType : String, step : String, links: util.Map[String, Link]): NodeDescriptor = {
    val descriptor = new NodeDescriptor
    descriptor.title = title
    descriptor.description = description
    descriptor.widget = widget
    descriptor.id = id
    descriptor.name = name
    descriptor.hidden = hidden
    descriptor.`type` = aType
    descriptor.step = step
    descriptor.links = links
    descriptor
  }
}
