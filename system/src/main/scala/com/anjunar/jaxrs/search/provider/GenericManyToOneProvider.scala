package com.anjunar.jaxrs.search.provider

import com.anjunar.jaxrs.search.{Context, PredicateProvider}
import com.anjunar.scala.mapper.IdProvider
import com.anjunar.scala.universe.introspector.BeanProperty
import jakarta.persistence.EntityManager
import jakarta.persistence.criteria.{CriteriaBuilder, CriteriaQuery, Predicate, Root}

import java.util.{Objects, UUID}
import scala.collection.mutable


class GenericManyToOneProvider[E] extends PredicateProvider[IdProvider, E] {
  override def build(context : Context[IdProvider, E]): Unit = {
    val Context(value, entityManager, builder, predicates, root, query, selection, property, name, parameters) = context

    if (Objects.nonNull(value)) 
      predicates.addOne(builder.equal(root.get(property.name).get("id"), value.id))
  }
}
