package com.anjunar.scala.mapper.helper

import com.anjunar.scala.introspector.DescriptionIntrospector
import com.anjunar.scala.universe.introspector.{AbstractProperty, BeanIntrospector, BeanProperty}
import jakarta.persistence.{ManyToMany, OneToMany, OneToOne}

import java.util

object JPAHelper {

  def resolveMappings(entity: AnyRef, property: AbstractProperty, propertyValue: Any): Unit = {
    val oneToOne = property.findAnnotation(classOf[OneToOne])
    if (oneToOne != null && oneToOne.mappedBy().nonEmpty) {
      val beanModel = DescriptionIntrospector.createWithType(propertyValue.getClass)
      val mappedByProperty = beanModel.findProperty(oneToOne.mappedBy())
      mappedByProperty.set(propertyValue.asInstanceOf[AnyRef], entity)
    }

    val oneToMany = property.findAnnotation(classOf[OneToMany])
    if (oneToMany != null && oneToMany.mappedBy().nonEmpty) {
      propertyValue match {
        case collection: util.Collection[AnyRef] =>
          collection.forEach(element => {
            val beanModel = DescriptionIntrospector.createWithType(element.getClass)
            val mappedByProperty = beanModel.findProperty(oneToMany.mappedBy())
            mappedByProperty.set(element, entity)
          })
      }
    }

    val manyToMany = property.findAnnotation(classOf[ManyToMany])
    if (manyToMany != null && manyToMany.mappedBy().nonEmpty) {
      propertyValue match {
        case collection: util.Collection[AnyRef] =>
          collection.forEach { element =>
            val beanModel = DescriptionIntrospector.createWithType(element.getClass)
            val inverseCollectionProp = beanModel.findProperty(manyToMany.mappedBy())
            val inverseCollectionValue = inverseCollectionProp.get(element) match {
              case null =>
                val newList = new util.ArrayList[AnyRef]()
                inverseCollectionProp.set(element, newList)
                newList
              case existing: util.Collection[AnyRef] => existing
            }
            if (!inverseCollectionValue.contains(entity)) {
              inverseCollectionValue.add(entity)
            }
          }
      }
    }
  }


}
