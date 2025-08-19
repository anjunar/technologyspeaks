package com.anjunar.jpa

import com.typesafe.scalalogging.Logger
import jakarta.enterprise.inject.spi.CDI
import jakarta.inject.Inject
import jakarta.persistence.{Entity, NoResultException}
import org.hibernate.reactive.stage.Stage

import java.util
import java.util.concurrent.{CompletableFuture, CompletionStage}
import java.util.function.Function
import scala.compiletime.uninitialized

trait RepositoryContext[E](clazz: Class[E]) {

  val log = Logger[RepositoryContext[E]]

  def find(id: Object)(implicit session : Stage.Session): CompletionStage[E] = {
    session.find(clazz, id)
  }

  def findAll()(implicit session : Stage.Session): CompletionStage[util.List[E]] = {
    val builder = session.getCriteriaBuilder
    val query = builder.createQuery(clazz)
    val root = query.from(clazz)
    session.createQuery(query.select(root)).getResultList
  }

  def query(parameters: (key: String, value: Any)*)(implicit session : Stage.Session): CompletionStage[E] = {
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

    typedQuery.getSingleResultOrNull
  }

}
