package com.anjunar.jaxrs.types

import java.time.LocalDate
import scala.beans.BeanProperty
import scala.compiletime.uninitialized


class DateDuration {

  var from: LocalDate = uninitialized
  
  var to: LocalDate = uninitialized

}
