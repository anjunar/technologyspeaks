package com.anjunar.jaxrs.search.jpa

import jakarta.persistence.criteria.{Expression, Order, Predicate, Selection}

import java.util
import scala.collection.mutable


case class JPASearchContextResult(selection : Array[Expression[java.lang.Double]],
                                  predicates: Array[Predicate],
                                  parameters: mutable.Map[String, Any])
