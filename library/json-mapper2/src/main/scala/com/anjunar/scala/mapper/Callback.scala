package com.anjunar.scala.mapper

import java.lang.annotation.Annotation

trait Callback {

  def call(instance : AnyRef, annotations : Array[Annotation]) : AnyRef

}
