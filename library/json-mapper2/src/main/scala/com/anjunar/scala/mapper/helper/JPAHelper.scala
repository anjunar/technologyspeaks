package com.anjunar.scala.mapper.helper

import com.anjunar.scala.introspector.DescriptionIntrospector
import com.anjunar.scala.universe.TypeResolver
import com.anjunar.scala.universe.introspector.{AbstractProperty, BeanIntrospector, BeanProperty}
import jakarta.persistence.{ManyToMany, OneToMany, OneToOne}

import java.util

object JPAHelper {

  def resolveMappings(entity: AnyRef, property: AbstractProperty, propertyValue: Any): Unit = {
    val oneToOne = property.findAnnotation(classOf[OneToOne])
    if (oneToOne != null && oneToOne.mappedBy().nonEmpty) {
      val resolvedClass = TypeResolver.resolve(propertyValue.getClass)
      val mappedByProperty = resolvedClass.findField(oneToOne.mappedBy())
      mappedByProperty.set(propertyValue.asInstanceOf[AnyRef], entity)
    }

    val oneToMany = property.findAnnotation(classOf[OneToMany])
    if (oneToMany != null && oneToMany.mappedBy().nonEmpty) {
      propertyValue match {
        case collection: util.Collection[AnyRef] =>
          collection.forEach(element => {
            val resolvedClass = TypeResolver.resolve(element.getClass)
            val mappedByProperty = resolvedClass.findField(oneToMany.mappedBy())
            mappedByProperty.set(element, entity)
          })
      }
    }

    val manyToMany = property.findAnnotation(classOf[ManyToMany])
    if (manyToMany != null && manyToMany.mappedBy().nonEmpty) {
      propertyValue match {
        case collection: util.Collection[AnyRef] =>
          collection.forEach { element =>
            val resolvedClass = TypeResolver.resolve(element.getClass)
            val getter = resolvedClass.findMethod(manyToMany.mappedBy())

            val inverseCollectionValue = getter.invoke(element) match {
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
