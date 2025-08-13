package com.anjunar.jaxrs.search.jpa

import com.anjunar.jaxrs.search.{Context, PredicateProvider, SearchBeanReader}
import com.anjunar.jaxrs.types.AbstractSearch
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.persistence.{EntityManager, EntityManagerFactory}
import jakarta.persistence.criteria.*

import java.util
import java.util.List
import scala.collection.mutable
import scala.compiletime.uninitialized


@ApplicationScoped
class JPASearch {
  
  @Inject 
  var factory: EntityManagerFactory = uninitialized

  def searchContext[V <: AbstractSearch, E](search: V, predicateProviders : PredicateProvider[V,E]*): JPASearchContext = {
    val context = new JPASearchContext() {
      override def apply[C](entityManager: EntityManager, builder: CriteriaBuilder, query: CriteriaQuery[?], root: Root[C]): JPASearchContextResult = {
        val (predicates, parameters, selection) = SearchBeanReader.read(search, entityManager, builder, root, query)
        predicateProviders.foreach(predicate => predicate.build(Context(search, entityManager, builder, predicates, root.asInstanceOf[Root[E]], query, selection, null, null, parameters)))
        JPASearchContextResult(selection.toArray, predicates.toArray, parameters)
      }

      override def sort[C](entityManager: EntityManager, builder: CriteriaBuilder, query: CriteriaQuery[?], root: Root[C],  selection : Expression[java.lang.Double], predicates : mutable.Buffer[Predicate]): Array[Order] = {
        SearchBeanReader.order(search, entityManager, builder, root, query, selection, predicates)
      }
    }
    context
  }

  def entities[E](index: Int, limit: Int, entityClass: Class[E], context: JPASearchContext): util.List[jakarta.persistence.Tuple] = {
    val entityManager = factory.createEntityManager()
    val builder = factory.getCriteriaBuilder
    val query = builder.createTupleQuery()
    val root = query.from(entityClass)
    val search = context.apply(entityManager, builder, query, root)

    val typedQuery = if (search.selection.isEmpty) {
      val orders = context.sort(entityManager, builder, query, root, null, search.predicates.toBuffer)
      entityManager.createQuery(query.multiselect(root).where(search.predicates *).orderBy(orders *))
    } else {
      val sumExpr = search.selection.reduce((a, b) => builder.sum(a, b))
      val count = Double.box(search.selection.length.toDouble)
      val score = builder.quot(sumExpr, builder.literal(count)).asInstanceOf[Expression[java.lang.Double]]
      val orders = context.sort(entityManager, builder, query, root, score, search.predicates.toBuffer)
      entityManager.createQuery(query.select(builder.tuple(root, score.alias("score"))).where(search.predicates *).orderBy(orders *))
    }

    search.parameters.foreach((key, value) => typedQuery.setParameter(key, value))
    typedQuery
      .setFirstResult(index)
      .setMaxResults(limit)
      .getResultList
  }

  def count[E](entityClass: Class[E], context: JPASearchContext): Long = {
    val entityManager = factory.createEntityManager()
    val builder = factory.getCriteriaBuilder
    val query = builder.createQuery(classOf[java.lang.Long])
    val root = query.from(entityClass)
    val apply = context.apply(entityManager, builder, query, root)
    val typedQuery = entityManager.createQuery(query.select(builder.count(root)).where(apply.predicates *))
    apply.parameters.foreach((key, value) => typedQuery.setParameter(key, value))
    typedQuery.getSingleResult
  }
}
