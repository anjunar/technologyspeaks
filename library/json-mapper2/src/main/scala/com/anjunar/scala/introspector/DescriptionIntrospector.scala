package com.anjunar.scala.introspector

import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}

import java.lang.reflect.Type
import java.util
import java.util.Objects

object DescriptionIntrospector {

  private val cache = new util.HashMap[ResolvedClass, DescriptorsModel]

  def create(aClass: ResolvedClass): DescriptorsModel = {
    var descriptorsModel = cache.get(aClass)
    if (Objects.isNull(descriptorsModel)) {
      descriptorsModel = new DescriptorsModel(aClass)
      cache.put(aClass, descriptorsModel)
    }
    descriptorsModel
  }

  def createWithType(aType: Type): DescriptorsModel = create(TypeResolver.resolve(aType))


}
