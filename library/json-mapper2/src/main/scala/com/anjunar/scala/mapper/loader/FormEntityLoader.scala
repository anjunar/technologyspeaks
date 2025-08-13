package com.anjunar.scala.mapper.loader

import com.anjunar.scala.mapper.intermediate.model.JsonObject
import com.anjunar.scala.universe.ResolvedClass

import java.lang.annotation.Annotation

trait FormEntityLoader {

  def load(fields: Map[String, List[String]], aType: ResolvedClass, annotations: Array[Annotation]): AnyRef

}
