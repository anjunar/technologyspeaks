package com.anjunar.jaxrs.search.provider

import com.anjunar.jaxrs.search.{Context, PredicateProvider}
import com.anjunar.scala.universe.introspector.BeanProperty
import com.google.common.base.Strings
import jakarta.persistence.EntityManager
import jakarta.persistence.criteria.{CriteriaBuilder, CriteriaQuery, Predicate, Root}

import java.util.{Objects, UUID}
import scala.collection.mutable


class GenericIdProvider[E] extends PredicateProvider[UUID, E] {
  override def build(context : Context[UUID, E]): Unit = {
    val Context(value, entityManager, builder, predicates, root, query, selection, property, name, parameters) = context

    if (Objects.nonNull(value)) {
      predicates.addOne(builder.equal(root.get(property.name), value))
    }

  }
}
