package com.anjunar.technologyspeaks.shared.i18n

import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import jakarta.persistence.Basic

import java.util.Locale
import scala.beans.BeanProperty
import scala.compiletime.uninitialized

class Translation {

  @PropertyDescriptor(title = "Text", naming = true)
  @Basic
  var text : String = uninitialized

  @PropertyDescriptor(title = "Language", naming = true)
  @Basic
  var locale : Locale = uninitialized
  
  override def toString = s"Translation($text, $locale)"
}
