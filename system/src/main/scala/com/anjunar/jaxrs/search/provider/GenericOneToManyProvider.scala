package com.anjunar.jaxrs.search.provider

import com.anjunar.jaxrs.search.{Context, PredicateProvider}
import com.anjunar.scala.mapper.IdProvider
import com.anjunar.scala.universe.introspector.BeanProperty
import jakarta.persistence.EntityManager
import jakarta.persistence.criteria.*

import java.util
import java.util.{Set, UUID}
import scala.collection.mutable


class GenericOneToManyProvider[E] extends PredicateProvider[util.Set[IdProvider], E] {
  override def build(context : Context[util.Set[IdProvider], E]): Unit = {
    val Context(value, entityManager, builder, predicates, root, query, selection, property, name, parameters) = context

    if (value != null && ! value.isEmpty)
      val join = root.join(property.name)
      predicates.addOne(join.get("id").in(value.stream().map(_.id).toList))
  }
}
