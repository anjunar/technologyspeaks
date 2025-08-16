package com.anjunar.jpa

import io.smallrye.mutiny.Uni
import jakarta.enterprise.inject.spi.CDI
import jakarta.persistence.{Entity, EntityManager, NoResultException, TypedQuery}
import org.hibernate.reactive.mutiny.Mutiny
import org.hibernate.reactive.stage.Stage
import org.hibernate.reactive.stage.Stage.SelectionQuery

import java.util
import java.util.UUID
import java.util.concurrent.{CompletableFuture, CompletionStage}
import java.util.function.Function

trait RepositoryContext[E](clazz: Class[E]) {

  private val sessionFactories = CDI.current().select(classOf[Stage.SessionFactory])

  def find(id: Object): CompletionStage[E] = {
    sessionFactory.withTransaction(session => {
      session.find(clazz, id)
    })
  }

  def findAll() : CompletionStage[util.List[E]] = {
    sessionFactory.withTransaction(session => {
      val builder = session.getCriteriaBuilder
      val query = builder.createQuery(clazz)
      val root = query.from(clazz)
      session.createQuery(query.select(root)).getResultList
    })
  }

  def query(parameters: (key : String, value : Any)*): CompletionStage[E] = {
    sessionFactory.withTransaction(session => {
      val entityAnnotation: Entity = clazz.getAnnotation(classOf[Entity])
      var entityName: String = entityAnnotation.name()
      if (entityName == null || entityName.isEmpty) {
        entityName = clazz.getSimpleName
      }
      val sqlParams: String = parameters.map(o => s"e.${o.key} = :${o.key}").mkString(" and ")
      val typedQuery: Stage.SelectionQuery[E] = session.createQuery(s"select e from $entityName e where $sqlParams", clazz)
      for (entry <- parameters) {
        typedQuery.setParameter(entry.key, entry.value)
      }
      try {
        typedQuery.getSingleResult
      } catch {
        case e: NoResultException => CompletableFuture.failedStage(e.getCause)
      }
    })
  }

  def sessionFactory: Stage.SessionFactory = sessionFactories.get()
  
  def withTransaction[T](work: Function[Stage.Session, CompletionStage[T]]) = sessionFactory.withTransaction(work)

}
