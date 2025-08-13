package com.anjunar.jaxrs.search.provider

import com.anjunar.jaxrs.search.{Context, PredicateProvider}
import com.anjunar.jaxrs.types.LongIntervall
import com.anjunar.scala.universe.introspector.BeanProperty
import jakarta.persistence.EntityManager
import jakarta.persistence.criteria.*

import java.util.Objects
import scala.collection.mutable


class GenericNumberIntervallProvider[E] extends PredicateProvider[LongIntervall, E] {
  override def build(context : Context[LongIntervall, E]): Unit = {
    val Context(value, entityManager, builder, predicates, root, query, selection, property, name, parameters) = context

    if (Objects.nonNull(value)) {
      val path: Path[java.lang.Long] = root.get(property.name)
      predicates.addOne(builder.between(path, value.from, value.to))
    }
  }
}
