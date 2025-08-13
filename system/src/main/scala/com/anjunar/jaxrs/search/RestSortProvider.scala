package com.anjunar.jaxrs.search

import com.google.common.base.Strings
import jakarta.persistence.EntityManager
import jakarta.persistence.criteria.{CriteriaBuilder, Order, Path, Root}

import java.util
import java.util.List


trait RestSortProvider[V, E] {
  
  def sort(context : Context[V, E]): util.List[Order]

  def cursor1(path: Path[_], pathString: String): Path[_] = {
    if (Strings.isNullOrEmpty(pathString)) return path
    val paths = pathString.split("\\.")
    var cursor = path
    for (segment <- paths) {
      cursor = cursor.get(segment)
    }
    cursor
  }
}
