package com.anjunar.scala.schema.model

import com.anjunar.scala.mapper.annotations.{PropertyDescriptor, IgnoreFilter}

import scala.annotation.meta.field

@IgnoreFilter
case class Link(@(PropertyDescriptor @field)(title = "URL") url: String,
                @(PropertyDescriptor @field)(title = "Method") method: String,
                @(PropertyDescriptor @field)(title = "Relation") rel: String,
                @(PropertyDescriptor @field)(title = "Title") title: String)
