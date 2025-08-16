package com.anjunar.technologyspeaks.shared.i18n

import com.anjunar.jpa.{Pair, RepositoryContext}
import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.technologyspeaks.shared.AbstractEntity
import jakarta.persistence.{Basic, Column, Entity}
import org.hibernate.annotations.Type

import java.util
import java.util.Locale
import scala.beans.BeanProperty
import scala.compiletime.uninitialized

@Entity
class I18n extends AbstractEntity {

  @PropertyDescriptor(title = "Text", writeable = true, naming = true)
  @Basic
  var text: String = uninitialized

  @PropertyDescriptor(title = "Translations", writeable = true)
  @Column(columnDefinition = "jsonb")
  @Type(classOf[TranslationType])
  val translations: util.Set[Translation] = new util.HashSet[Translation]()
  
  override def toString = s"I18n($text)"
} 

object I18n extends RepositoryContext[I18n](classOf[I18n]) {
  
  val languages: Array[Locale] = Array(Locale.FRENCH, Locale.GERMAN)

}
