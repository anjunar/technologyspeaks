package com.anjunar.olama

import ChatFunction.Callee

import java.util
import scala.beans.BeanProperty
import scala.compiletime.uninitialized

class ChatFunction {

  var function : Callee = uninitialized

}

object ChatFunction {

  class Callee {

      var name : String = uninitialized

      val arguments : util.LinkedHashMap[String, Any] = new util.LinkedHashMap[String, Any]()

  }

}
