package com.anjunar.scala.mapper

import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import java.lang
import java.util.UUID


trait IdProvider {

  @PropertyDescriptor(title = "Id")
  def id: UUID

  def version: lang.Integer

}
