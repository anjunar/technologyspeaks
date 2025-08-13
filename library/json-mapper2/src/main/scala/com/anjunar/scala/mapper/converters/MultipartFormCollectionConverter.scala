package com.anjunar.scala.mapper.converters

import com.anjunar.scala.mapper.{IdProvider, MultipartFormContext}
import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}

class MultipartFormCollectionConverter extends MultipartFormAbstractConverter(TypeResolver.resolve(classOf[java.util.Collection[?]])) {

  override def toJava(values: List[String], aType: ResolvedClass, context: MultipartFormContext): Any = {
    if (classOf[IdProvider].isAssignableFrom(aType.typeArguments.head.raw)) {
      values.map(value => context.loader.load(Map(("id" -> List(value))), aType.typeArguments.head, Array()))
    } else {
      val converter = context.registry.find(aType.typeArguments.head)
      values.map(value => converter.toJava(List(value), aType.typeArguments.head, context))
    }
  }

}
