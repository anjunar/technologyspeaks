package com.anjunar.jaxrs.search

import com.anjunar.scala.universe.introspector.{AbstractProperty, BeanProperty}
import jakarta.persistence.EntityManager
import jakarta.persistence.criteria.{CriteriaBuilder, CriteriaQuery, Expression, Predicate, Root, Selection}

import scala.collection.mutable

case class Context[V,E](value: V,
                        entityManager: EntityManager,
                        builder: CriteriaBuilder,
                        predicates : mutable.Buffer[Predicate],
                        root: Root[E],
                        query: CriteriaQuery[?],
                        selection : mutable.Buffer[Expression[java.lang.Double]],
                        property: AbstractProperty,
                        name: String,
                        parameters: mutable.Map[String, Any])
