package com.anjunar.technologyspeaks.shared.editor

import jakarta.persistence.{Entity, Lob}

import scala.beans.BeanProperty
import scala.compiletime.uninitialized

case class Text(position : Position, value : String) extends TextNode
