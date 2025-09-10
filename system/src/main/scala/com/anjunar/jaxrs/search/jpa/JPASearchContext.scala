package com.anjunar.jaxrs.search.jpa

import jakarta.persistence.EntityManager
import jakarta.persistence.criteria.*
import org.hibernate.reactive.stage.Stage

import scala.collection.mutable


trait JPASearchContext {
  def apply[C](entityManager: Stage.Session, builder: CriteriaBuilder, query: CriteriaQuery[?], root: Root[C]): JPASearchContextResult

  def sort[C](entityManager: Stage.Session, builder: CriteriaBuilder, query: CriteriaQuery[?], root: Root[C], selection : Expression[java.lang.Double], predicates : mutable.Buffer[Predicate]): Array[Order]
}
