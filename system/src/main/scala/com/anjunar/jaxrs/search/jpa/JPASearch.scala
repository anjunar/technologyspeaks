package com.anjunar.jaxrs.search.jpa

import com.anjunar.jaxrs.search.jpa.{JPASearchContext, JPASearchContextResult}
import com.anjunar.jaxrs.search.{Context, PredicateProvider, SearchBeanReader}
import com.anjunar.jaxrs.types.{AbstractSearch, Table}
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.persistence.Tuple
import jakarta.persistence.criteria.*
import org.hibernate.reactive.stage.Stage

import java.util
import java.util.concurrent.{CompletableFuture, CompletionStage}
import scala.collection.mutable
import scala.compiletime.uninitialized

@ApplicationScoped
class JPASearch {

  @Inject
  var sessionFactory: Stage.SessionFactory = uninitialized

  def searchContext[V <: AbstractSearch, E](search: V, predicateProviders: PredicateProvider[V, E]*): JPASearchContext = {
    val context = new JPASearchContext() {
      override def apply[C](entityManager: Stage.Session, builder: CriteriaBuilder, query: CriteriaQuery[?], root: Root[C]): JPASearchContextResult = {
        val (predicates, parameters, selection) = SearchBeanReader.read(search, entityManager, builder, root, query)
        predicateProviders.foreach(predicate => predicate.build(Context(search, entityManager, builder, predicates, root.asInstanceOf[Root[E]], query, selection, null, null, parameters)))
        JPASearchContextResult(selection.toArray, predicates.toArray, parameters)
      }

      override def sort[C](entityManager: Stage.Session, builder: CriteriaBuilder, query: CriteriaQuery[?], root: Root[C], selection: Expression[java.lang.Double], predicates: mutable.Buffer[Predicate]): Array[Order] = {
        SearchBeanReader.order(search, entityManager, builder, root, query, selection, predicates)
      }
    }
    context
  }

  def entities[E](index: Int, limit: Int, entityClass: Class[E], context: JPASearchContext)(implicit session: Stage.Session): CompletionStage[util.List[Tuple]] = {
    val builder = session.getCriteriaBuilder
    val query = builder.createTupleQuery()
    val root = query.from(entityClass)
    val search = context.apply(session, builder, query, root)

    val typedQuery = if (search.selection.isEmpty) {
      val orders = context.sort(session, builder, query, root, null, search.predicates.toBuffer)
      session.createQuery(query.multiselect(root).where(search.predicates *).orderBy(orders *))
    } else {
      val sumExpr = search.selection.reduce((a, b) => builder.sum(a, b))
      val count = Double.box(search.selection.length.toDouble)
      val score = builder.quot(sumExpr, builder.literal(count)).asInstanceOf[Expression[java.lang.Double]]
      val orders = context.sort(session, builder, query, root, score, search.predicates.toBuffer)
      session.createQuery(query.select(builder.tuple(root, score.alias("score"))).where(search.predicates *).orderBy(orders *))
    }

    search.parameters.foreach((key, value) => typedQuery.setParameter(key, value))
    typedQuery
      .setFirstResult(index)
      .setMaxResults(limit)
      .getResultList
  }

  def count[E](entityClass: Class[E], context: JPASearchContext)(implicit session: Stage.Session): CompletionStage[java.lang.Long] = {
    val builder = session.getCriteriaBuilder
    val query = builder.createQuery(classOf[java.lang.Long])
    val root = query.from(entityClass)
    val apply = context.apply(session, builder, query, root)
    val typedQuery = session.createQuery(query.select(builder.count(root)).where(apply.predicates *))
    apply.parameters.foreach((key, value) => typedQuery.setParameter(key, value))
    typedQuery.getSingleResult
  }

  def run[E, S <: AbstractSearch](search: S, value: Class[E]) = {
    val context = searchContext(search)

    val tuples = sessionFactory.withSession { implicit session =>
        entities(search.index, search.limit, value, context)
          .thenCompose { entities =>
            fetchEntitiesRecursively(entities, value, session)
          }
      }
      .toCompletableFuture

    val size = sessionFactory.openSession()
      .thenCompose { implicit session =>
        count(value, context)
          .whenComplete { (_, _) => session.close() }
      }
      .toCompletableFuture

    CompletableFuture.allOf(tuples, size)
      .thenApply { _ =>
        new Table(tuples.join().stream().map(tuple => tuple.get(0, value)).toList, size.join())
      }
  }

  def fetchEntitiesRecursively(entities: util.List[Tuple], entityClass: Class[?], session: Stage.Session, depth: Int = 0, maxDepth: Int = 5): CompletableFuture[util.List[Tuple]] = {
    JPAUtil.fetchEntitiesRecursively(entities, entityClass, session)
  }

  def fetchEntityRecursively(entity: AnyRef, entityClass: Class[?], session: Stage.Session, depth: Int = 0, maxDepth: Int = 5): CompletableFuture[Void] = {
    JPAUtil.fetchEntityRecursively(entity, entityClass, session)
  }

}
