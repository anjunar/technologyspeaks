package com.anjunar.jaxrs.search.provider

import com.anjunar.scala.universe.introspector.BeanProperty
import com.anjunar.jaxrs.search.{Context, PredicateProvider}
import jakarta.persistence.EntityManager
import jakarta.persistence.criteria.{CriteriaBuilder, CriteriaQuery, Predicate, Root}

import java.time.{LocalDate, LocalDateTime}
import java.util.Objects
import scala.collection.mutable


class GenericDateProvider[E] extends PredicateProvider[LocalDate, E] {
  override def build(context : Context[LocalDate, E]): Unit = {
    val Context(value, entityManager, builder, predicates, root, query, selection, property, name, parameters) = context

    if (Objects.nonNull(value)) {
      val start = value.atStartOfDay
      predicates.addOne(builder.between(root.get(property.name), start, start.plusDays(1)))
    }
  }
}
