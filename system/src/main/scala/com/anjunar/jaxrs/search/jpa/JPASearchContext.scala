package com.anjunar.jaxrs.search.jpa

import jakarta.persistence.EntityManager
import jakarta.persistence.criteria.{CriteriaBuilder, CriteriaQuery, Expression, Order, Predicate, Root}

import scala.collection.mutable


trait JPASearchContext {
  def apply[C](entityManager: EntityManager, builder: CriteriaBuilder, query: CriteriaQuery[?], root: Root[C]): JPASearchContextResult

  def sort[C](entityManager: EntityManager, builder: CriteriaBuilder, query: CriteriaQuery[?], root: Root[C], selection : Expression[java.lang.Double], predicates : mutable.Buffer[Predicate]): Array[Order]
}
