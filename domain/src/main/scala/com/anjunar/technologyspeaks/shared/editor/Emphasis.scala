package com.anjunar.technologyspeaks.shared.editor

import jakarta.persistence.Entity

import java.util
import scala.jdk.CollectionConverters.*

case class Emphasis(position : Position, children : util.List[Node]) extends ContainerNode

