package com.anjunar.scala.mapper.converters

import com.anjunar.scala.mapper.MultipartFormContext
import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}

class MultipartFormNumberConverter extends MultipartFormAbstractConverter(TypeResolver.resolve(classOf[Number])) {

  override def toJava(values: List[String], aType: ResolvedClass, context: MultipartFormContext): Any = aType.raw match {
    case bigDecimal if bigDecimal == classOf[java.math.BigDecimal] =>
      val constructor = bigDecimal.getConstructor(classOf[String])
      constructor.newInstance(values.head)
    case bigInteger if bigInteger == classOf[java.math.BigInteger] =>
      val constructor = bigInteger.getConstructor(classOf[String])
      constructor.newInstance(values.head)
    case _ =>
      val method = aType.findDeclaredMethod("valueOf", classOf[String])
      method.invoke(null, values.head)
  }
}
