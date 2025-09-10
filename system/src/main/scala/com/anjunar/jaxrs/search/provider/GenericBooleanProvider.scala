package com.anjunar.jaxrs.search.provider

import com.anjunar.jaxrs.search.{Context, PredicateProvider}


class GenericBooleanProvider[E] extends PredicateProvider[Boolean, E] {
  override def build(context: Context[Boolean, E]): Unit = {
    val Context(value, entityManager, builder, predicates, root, query, selection, property, name, parameters) = context

    predicates.addOne(builder.equal(root.get(property.name), value))
  }
}
