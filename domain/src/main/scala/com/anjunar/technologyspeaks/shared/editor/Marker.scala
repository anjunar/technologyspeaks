package com.anjunar.technologyspeaks.shared.editor

import scala.beans.BeanProperty
import scala.compiletime.uninitialized

case class Marker(column: Int, line: Int, offset: Int)