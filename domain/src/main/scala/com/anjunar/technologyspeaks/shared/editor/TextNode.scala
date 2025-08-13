package com.anjunar.technologyspeaks.shared.editor

import jakarta.persistence.{Entity, Lob}

import scala.beans.BeanProperty
import scala.compiletime.uninitialized

trait TextNode extends Node {

  def value: String

}
