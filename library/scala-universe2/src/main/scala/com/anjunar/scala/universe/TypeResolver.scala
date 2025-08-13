package com.anjunar.scala.universe

import java.lang.reflect.{ParameterizedType, Type, TypeVariable}
import scala.collection.mutable

object TypeResolver {
  
  val cache = new mutable.HashMap[Type, ResolvedClass]()
  
  def resolve(aType : Type) : ResolvedClass = {
    val option = cache.get(aType)
    if (option.isDefined) {
      option.get
    } else {
      val resolvedClass = new ResolvedClass(aType)
      cache.put(aType, resolvedClass)
      resolvedClass
    }
  }

  def rawType(aType: Type): Class[?] = aType match {
    case aClass: Class[?] => aClass
    case parameterizedType: ParameterizedType => rawType(parameterizedType.getRawType)
    case typeVariable: TypeVariable[?] => rawType(generateParameterizedType(typeVariable))
    case _ => throw new IllegalStateException("Unexpected value: " + aType)
  }

  private def generateParameterizedType(typeVariable: TypeVariable[?]): ParameterizedType = new ParameterizedType() {
    override def getActualTypeArguments: Array[Type] = typeVariable.getBounds

    override def getRawType: Type = typeVariable.getGenericDeclaration.asInstanceOf[Type]

    override def getOwnerType: Type = null
  }


}
