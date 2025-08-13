package com.anjunar.jaxrs.types

import com.anjunar.jaxrs.search.provider.GenericSortProvider
import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.jaxrs.search.RestSort
import jakarta.ws.rs.QueryParam

import scala.beans.BeanProperty
import java.util

abstract class AbstractSearch {

  @PropertyDescriptor(title = "Sort", writeable = true, hidden = true)
  @RestSort(classOf[GenericSortProvider[?]])
  @QueryParam("sort")
  val sort: util.List[String] = new util.ArrayList[String]()

  @PropertyDescriptor(title = "Index", writeable = true, hidden = true)
  @QueryParam("index")
  var index = 0

  @PropertyDescriptor(title = "Limit", writeable = true, hidden = true)
  @QueryParam("limit")
  var limit = 5

}
