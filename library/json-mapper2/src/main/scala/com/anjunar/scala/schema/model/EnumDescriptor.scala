package com.anjunar.scala.schema.model

import com.anjunar.scala.mapper.annotations.{PropertyDescriptor, IgnoreFilter}

import java.util
import scala.beans.BeanProperty

@IgnoreFilter
class EnumDescriptor extends NodeDescriptor {

  @PropertyDescriptor(title = "Enumeration")
  var enums : util.List[String] = new util.ArrayList[String]()
  
}

object EnumDescriptor {
  def apply(title: String, 
            description: String,
            widget: String, 
            id: Boolean, 
            name: Boolean, 
            hidden : Boolean,
            aType: String, 
            links: util.Map[String, Link],
            enums : util.List[String]): EnumDescriptor = {
    
    val descriptor = new EnumDescriptor
    descriptor.title = title
    descriptor.description = description
    descriptor.widget = widget
    descriptor.id = id
    descriptor.name = name
    descriptor.hidden = hidden
    descriptor.`type` = aType
    descriptor.links = links
    descriptor.enums = enums
    descriptor
  }
}
