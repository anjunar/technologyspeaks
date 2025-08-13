package com.anjunar.jaxrs.search

import com.anjunar.scala.introspector.DescriptionIntrospector
import com.anjunar.scala.universe.introspector.BeanIntrospector
import jakarta.persistence.EntityManager
import jakarta.persistence.criteria.*

import java.lang.reflect.InvocationTargetException
import java.{lang, util}
import java.util.function.IntFunction
import java.util.{ArrayList, List, Objects}
import scala.collection.mutable
import scala.collection.mutable.ListBuffer


object SearchBeanReader {
  
  def read[E](search: AnyRef, entityManager: EntityManager, builder: CriteriaBuilder, root: Root[E], query: CriteriaQuery[?]): (mutable.Buffer[Predicate], mutable.Map[String, Any], mutable.Buffer[Expression[java.lang.Double]]) = {
    val beanModel = DescriptionIntrospector.createWithType(search.getClass)
    val predicates = new mutable.ListBuffer[Predicate]
    val selection = new mutable.ListBuffer[Expression[java.lang.Double]]
    val parameters = mutable.Map[String, Any]()
    for (property <- beanModel.properties) {
      val restPredicate = property.findDeclaredAnnotation(classOf[RestPredicate])
      if (Objects.nonNull(restPredicate)) {
        val value = property.get(search)
        val predicateClass = restPredicate.value
        val jpaPredicate = predicateClass.getConstructor().newInstance().asInstanceOf[PredicateProvider[AnyRef, E]]
        jpaPredicate.build(Context(value.asInstanceOf[AnyRef], entityManager, builder, predicates, root, query, selection, property, restPredicate.property(), parameters))
      }
    }
    (predicates, parameters, selection)
  }

  def order[E](search: AnyRef, entityManager: EntityManager, builder: CriteriaBuilder, root: Root[E], query: CriteriaQuery[?], selection : Expression[java.lang.Double], predicates : mutable.Buffer[Predicate]): Array[Order] = {
    val beanModel = DescriptionIntrospector.createWithType(search.getClass)
    var orders : util.List[Order] = new util.ArrayList[Order]
    for (property <- beanModel.properties) {
      val restPredicate = property.findDeclaredAnnotation(classOf[RestSort])
      if (Objects.nonNull(restPredicate)) {
        val value = property.get(search)
        val predicateClass = restPredicate.value
        val jpaPredicate = predicateClass.getConstructor().newInstance().asInstanceOf[RestSortProvider[AnyRef, E]]
        orders = jpaPredicate.sort(Context(value.asInstanceOf[AnyRef], entityManager, builder, predicates, root, query, ListBuffer(selection), property, null, null))
      }
    }
    orders.toArray((value: Int) => new Array[Order](value))
  }
}
