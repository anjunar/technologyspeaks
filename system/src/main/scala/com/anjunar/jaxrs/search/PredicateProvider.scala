package com.anjunar.jaxrs.search

import com.anjunar.scala.universe.introspector.BeanProperty
import jakarta.persistence.EntityManager
import jakarta.persistence.criteria.{CriteriaBuilder, CriteriaQuery, Predicate, Root}

import scala.collection.mutable

trait PredicateProvider[V, E] {
  def build(context : Context[V,E]) : Unit
}
