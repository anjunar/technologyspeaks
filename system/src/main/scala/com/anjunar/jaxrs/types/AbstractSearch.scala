package com.anjunar.jaxrs.types

import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.jaxrs.search.RestSort
import com.anjunar.jaxrs.search.provider.GenericSortProvider
import jakarta.ws.rs.{DefaultValue, QueryParam}

import java.util

abstract class AbstractSearch {

  @PropertyDescriptor(title = "Sort", hidden = true)
  @RestSort(classOf[GenericSortProvider[?]])
  @QueryParam("sort")
  val sort: util.List[String] = new util.ArrayList[String]()

  @PropertyDescriptor(title = "Index", hidden = true)
  @QueryParam("index")
  @DefaultValue("0")  
  var index = 0

  @PropertyDescriptor(title = "Limit", hidden = true)
  @QueryParam("limit")
  @DefaultValue("5")
  var limit = 5

}
