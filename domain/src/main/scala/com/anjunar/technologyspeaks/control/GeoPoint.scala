package com.anjunar.technologyspeaks.control

import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import jakarta.persistence.{Basic, Embeddable}

import scala.beans.BeanProperty
import scala.compiletime.uninitialized


@Embeddable
class GeoPoint {

  @Basic
  @PropertyDescriptor(title = "Lan")
  var x : Double = uninitialized

  @Basic
  @PropertyDescriptor(title = "Lat")
  var y : Double = uninitialized
  
  override def toString = s"GeoPoint($x, $y)"
}
