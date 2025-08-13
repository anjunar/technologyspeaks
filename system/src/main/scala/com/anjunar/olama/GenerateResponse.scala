package com.anjunar.olama

import scala.beans.BeanProperty
import scala.compiletime.uninitialized

class GenerateResponse extends AbstractResponse {

  var response : String = uninitialized

  var context : Array[Int] = uninitialized
  
}
