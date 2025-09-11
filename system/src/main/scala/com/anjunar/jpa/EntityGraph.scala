package com.anjunar.jpa

import com.anjunar.jaxrs.types.OwnerProvider
import com.anjunar.scala.introspector.DescriptionIntrospector
import com.anjunar.scala.mapper.IdProvider
import com.anjunar.security.SecurityUser

object EntityGraph {
  
  def complete[E](entity : E, entityClass : Class[E], currentUser : SecurityUser): E = {
    val e = entity.asInstanceOf[AnyRef]
    val model = DescriptionIntrospector.createWithType(entityClass)
    model.properties.foreach(property => {
      property.propertyType.raw match {
        case clazz : Class[E] if classOf[SecurityUser].isAssignableFrom(clazz) =>
          val childEntity = property.get(e).asInstanceOf[E]
          if (childEntity == null) {
            property.set(e, currentUser)
          }
        case clazz : Class[E] if classOf[IdProvider].isAssignableFrom(clazz) => 
          var childEntity = property.get(e).asInstanceOf[E]
          childEntity = if (childEntity == null) {
            val newInstance = clazz.getConstructor().newInstance().asInstanceOf[E]
            property.set(e, newInstance)
            newInstance
          } else {
            childEntity
          }
          complete(childEntity, clazz, currentUser)
        case _=> {}  
      }
    })
    
    entity
  }

}
