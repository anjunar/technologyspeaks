package com.anjunar.jpa

import jakarta.enterprise.inject.spi.CDI
import jakarta.persistence.{Entity, EntityManager, NoResultException, TypedQuery}

import java.util
import java.util.UUID

trait RepositoryContext[E](clazz: Class[E]) {

  private val entityManagers = CDI.current().select(classOf[EntityManager])

  def find(id: Object): E = {
    entityManager.find(clazz, id)
  }

  def reference(id: Object): E = {
    entityManager.getReference(clazz, id)
  }

  def findAll() : util.List[E] = {
    val builder = entityManager.getCriteriaBuilder
    val query = builder.createQuery(clazz)
    val root = query.from(clazz)
    entityManager.createQuery(query.select(root)).getResultList
  }

  def query(parameters: (key : String, value : Any)*): E = {
    val entityAnnotation: Entity = clazz.getAnnotation(classOf[Entity])
    var entityName: String = entityAnnotation.name()
    if (entityName == null || entityName.isEmpty) {
      entityName = clazz.getSimpleName
    }
    val sqlParams: String = parameters.map(o => s"e.${o.key} = :${o.key}").mkString(" and ")
    val typedQuery: TypedQuery[E] = entityManager.createQuery(s"select e from $entityName e where $sqlParams", clazz)
    for (entry <- parameters) {
      typedQuery.setParameter(entry.key, entry.value)
    }
    try {
      typedQuery.getSingleResult
    } catch {
      case e: NoResultException => null.asInstanceOf[E]
    }
  }

  def query(qlString: String): TypedQuery[E] = {
    entityManager.createQuery(qlString, clazz)
  }

  def count(qlString: String): TypedQuery[Long] = {
    entityManager.createQuery(qlString, classOf[Long])
  }

  def entityManager: EntityManager = {
    entityManagers.get()
  }

}
