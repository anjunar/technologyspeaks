package com.anjunar.jaxrs.search.provider

import com.anjunar.jaxrs.search.{Context, RestSortProvider}
import jakarta.persistence.EntityManager
import jakarta.persistence.criteria.{CriteriaBuilder, Order, Root}

import java.util
import java.util.{ArrayList, List}


class GenericSortProvider[E] extends RestSortProvider[util.List[String], E] {
  override def sort(context : Context[util.List[String], E]): util.List[Order] = {
    val Context(value, entityManager, builder, predicates, root, query, selection, property, name, parameters) = context

    val result = new util.ArrayList[Order]
    if (value == null) return result

    value.forEach(sortExpression => {
      val sortSegment = sortExpression.split(":")
      val key = sortSegment(0)
      val direction = sortSegment(1)

      if (key == "score") {
        if (selection.head != null) {
          direction match {
            case "asc" =>
              result.add(builder.asc(selection.head))
            case "desc" =>
              result.add(builder.desc(selection.head))
          }
        }
      } else {
        val cursor = cursor1(root, key)
        direction match {
          case "asc" =>
            result.add(builder.asc(cursor))
          case "desc" =>
            result.add(builder.desc(cursor))
        }
      }

    })

    result
  }
}
