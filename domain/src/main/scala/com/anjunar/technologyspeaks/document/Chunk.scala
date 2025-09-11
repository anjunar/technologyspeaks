package com.anjunar.technologyspeaks.document

import com.anjunar.jpa.annotations.{PostgresIndex, PostgresIndices}
import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.technologyspeaks.control.User
import com.anjunar.jpa.EntityContext
import com.anjunar.technologyspeaks.shared.AbstractEntity
import jakarta.persistence.{Basic, Column, Entity, Lob, ManyToOne, Transient}
import org.hibernate.`type`.SqlTypes
import org.hibernate.annotations.JdbcTypeCode

import scala.beans.BeanProperty
import scala.compiletime.uninitialized
import org.hibernate.annotations
import org.hibernate.envers.Audited


@Entity
@PostgresIndices(Array(
  new PostgresIndex(name = "chunk_idx_embedding", columnList = "embedding", using = "hnsw")
))
class Chunk extends AbstractEntity with EntityContext[Chunk]{

  @PropertyDescriptor(title = "Title")
  @Basic
  var title : String = uninitialized

  @PropertyDescriptor(title = "Content")
  @Lob
  @Column(columnDefinition = "text")
  @Basic
  var content : String = uninitialized

  @Column
  @JdbcTypeCode(SqlTypes.VECTOR)
  @annotations.Array(length = 768)
  @Basic
  var embedding: Array[Float] = uninitialized

  @ManyToOne(optional = false, targetEntity = classOf[Document])
  var document: Document = uninitialized
  
  override def toString = s"Chunk($title, $content)"
}
