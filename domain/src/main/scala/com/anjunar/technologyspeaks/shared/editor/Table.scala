package com.anjunar.technologyspeaks.shared.editor

import jakarta.persistence.Entity

import java.util
import scala.beans.BeanProperty
import scala.compiletime.uninitialized

case class Table(align : String, position : Position, children : util.List[Node]) extends ContainerNode
