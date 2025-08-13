package com.anjunar.technologyspeaks.shared.hashtag

import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.jpa.{PostgresIndex, PostgresIndices}
import com.anjunar.technologyspeaks.shared.AbstractEntity
import jakarta.persistence.{Basic, Column, Entity}
import org.hibernate.`type`.SqlTypes
import org.hibernate.annotations.JdbcTypeCode

import scala.beans.BeanProperty
import scala.compiletime.uninitialized
import org.hibernate.annotations


@Entity
@PostgresIndices(Array(
  new PostgresIndex(name = "hashtag_idx_value", columnList = "value", using = "GIN"),
  new PostgresIndex(name = "hashtag_idx_embedding", columnList = "embedding", using = "hnsw")
))
class HashTag extends AbstractEntity {

  @Basic
  @PropertyDescriptor(title = "HashTag", writeable = true, naming = true)
  var value : String = uninitialized

  @Basic
  @PropertyDescriptor(title = "Description", writeable = true)
  var description : String = uninitialized

  @Basic
  @JdbcTypeCode(SqlTypes.VECTOR)
  @annotations.Array(length = 768)
  var embedding: Array[Float] = uninitialized
  
  override def toString = s"HashTag($value, $description)"
}
