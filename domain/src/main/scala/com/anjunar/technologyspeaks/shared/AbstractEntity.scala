package com.anjunar.technologyspeaks.shared

import com.anjunar.scala.mapper.IdProvider
import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import jakarta.persistence.*

import java.lang
import java.time.LocalDateTime
import java.util.UUID
import scala.compiletime.uninitialized

@MappedSuperclass
abstract class AbstractEntity extends IdProvider {

  @Id
  @Column(name = "id", unique = true, nullable = false)
  @PropertyDescriptor(title = "Id", id = true, hidden = true, widget = "hidden")
  val id: UUID = UUID.randomUUID()

  @Version
  var version: lang.Integer = uninitialized

  @Basic
  var created: LocalDateTime = uninitialized

  @Basic
  var modified: LocalDateTime = uninitialized


  @PrePersist
  def onPersist(): Unit = {
    created = LocalDateTime.now()
    modified = LocalDateTime.now()
  }

  @PreUpdate
  def onMerge(): Unit = {
    modified = LocalDateTime.now()
  }

  override def equals(obj: Any): Boolean = obj match {
    case that: AbstractEntity => this.id == that.id
    case _ => false
  }

  override def hashCode(): Int = id.hashCode()

}


