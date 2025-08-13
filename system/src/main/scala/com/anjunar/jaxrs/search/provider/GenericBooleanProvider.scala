package com.anjunar.jaxrs.search.provider

import com.anjunar.jaxrs.search.{Context, PredicateProvider}
import com.anjunar.scala.universe.introspector.BeanProperty
import com.google.common.base.Strings
import jakarta.persistence.EntityManager
import jakarta.persistence.criteria.{CriteriaBuilder, CriteriaQuery, Predicate, Root}

import scala.collection.mutable


class GenericBooleanProvider[E] extends PredicateProvider[Boolean, E] {
  override def build(context : Context[Boolean, E]): Unit = {
    val Context(value, entityManager, builder, predicates, root, query, selection, property, name, parameters) = context

    predicates.addOne(builder.equal(root.get(property.name), value))
  }
}
