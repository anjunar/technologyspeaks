package com.anjunar.jaxrs.search.provider

import com.anjunar.jaxrs.search.{Context, PredicateProvider}
import com.anjunar.jaxrs.types.DateDuration
import com.anjunar.scala.universe.introspector.BeanProperty
import jakarta.persistence.EntityManager
import jakarta.persistence.criteria.{CriteriaBuilder, CriteriaQuery, Predicate, Root}

import scala.collection.mutable


class GenericDurationDateProvider[E] extends PredicateProvider[DateDuration, E] {
  override def build(context : Context[DateDuration, E]): Unit = {
    val Context(value, entityManager, builder, predicates, root, query, selection, property, name, parameters) = context

    val propertyName : String = if (name.nonEmpty) {
      name
    } else {
      property.name
    }

    if (value != null && value.from != null && value.to != null)
      predicates.addOne(builder.between(root.get(propertyName), value.from, value.to))
    if (value != null && value.from != null && value.to == null) 
      predicates.addOne(builder.greaterThan(root.get(propertyName), value.from))
    if (value != null && value.from == null && value.to != null) 
      predicates.addOne(builder.lessThan(root.get(propertyName), value.to))
  }
}
