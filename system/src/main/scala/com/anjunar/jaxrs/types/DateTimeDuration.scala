package com.anjunar.jaxrs.types

import java.time.LocalDateTime
import scala.beans.BeanProperty
import scala.compiletime.uninitialized


class DateTimeDuration {
  
  var from: LocalDateTime = uninitialized
  
  var to: LocalDateTime = uninitialized

}