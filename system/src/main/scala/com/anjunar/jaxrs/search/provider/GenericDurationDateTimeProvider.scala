package com.anjunar.jaxrs.search.provider

import com.anjunar.jaxrs.search.{Context, PredicateProvider}
import com.anjunar.jaxrs.types.DateTimeDuration
import com.anjunar.scala.universe.introspector.BeanProperty
import jakarta.persistence.EntityManager
import jakarta.persistence.criteria.{CriteriaBuilder, CriteriaQuery, Predicate, Root}

import java.time.LocalDateTime
import scala.collection.mutable


class GenericDurationDateTimeProvider[E] extends PredicateProvider[DateTimeDuration, E] {
  override def build(context : Context[DateTimeDuration, E]): Unit = {
    val Context(value, entityManager, builder, predicates, root, query, selection, property, name, parameters) = context

    if (! (value == null || value.from == null || value.to == null)) {

      val start = value.from
      val end = value.to
      predicates.addOne(builder.between(root.get(property.name), start, end))
    }
  }
}
