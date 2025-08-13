package com.anjunar.scala.universe.introspector

import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}

import java.lang.reflect.Type
import java.util
import java.util.Objects

object ScalaIntrospector {

  private val cache = new util.HashMap[ResolvedClass, ScalaModel]

  def create(aClass: ResolvedClass): ScalaModel = {
    var scalaModel = cache.get(aClass)
    if (Objects.isNull(scalaModel)) {
      scalaModel = new ScalaModel(aClass)
      cache.put(aClass, scalaModel)
    }
    scalaModel
  }

  def createWithType(aType: Type): ScalaModel = create(TypeResolver.resolve(aType))


}
