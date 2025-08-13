package com.anjunar.scala.universe.introspector

import com.anjunar.scala.universe.ResolvedClass

import java.lang.reflect.{ParameterizedType, Type}
import scala.reflect.runtime.universe

class ScalaModel(val underlying: ResolvedClass) {

  private val universeType : universe.Type = fromJavaType(underlying.underlying)

  private def fromJavaType(javaType: Type): universe.Type = javaType match {
    case pt: ParameterizedType =>
      val rawClass = pt.getRawType.asInstanceOf[Class[?]]
      val args = pt.getActualTypeArguments.map(fromJavaType).toList
      val rawTypeSymbol = universe.runtimeMirror(rawClass.getClassLoader).classSymbol(rawClass)
      universe.appliedType(rawTypeSymbol.toTypeConstructor, args)

    case cls: Class[_] =>
      universe.runtimeMirror(cls.getClassLoader).classSymbol(cls).toType

    case _ =>
      throw new UnsupportedOperationException(s"Unsupported java type: $javaType")
  }

  private lazy val universeProperties : Iterable[universe.Symbol] = universeType.members.filter(symbol => symbol.asTerm.isVal || symbol.asTerm.isVar)

  lazy val properties: Iterable[ScalaProperty] = universeProperties.map(symbol => {
    val name = symbol.name.decodedName.toString
    
    if (name.endsWith("$lzy1")) {
      val newName = name.substring(0, name.length - "$lzy1".length)
      val field = underlying.fields.find(field => field.name == name)
      val getter = underlying.methods.find(method => method.name == newName + "$lzyINIT1" && method.parameters.isEmpty)
      new ScalaProperty(this, newName, field.get, getter.get, null)
    } else {
      val field = underlying.fields.find(field => field.name == name)
      val getter = underlying.methods.find(method => method.name == name && method.parameters.isEmpty)

      if (symbol.asTerm.isVal) {
        if (getter.isDefined) {
          new ScalaProperty(this, name, field.get, getter.get, null)  
        } else {
          new ScalaProperty(this, name, field.get, null, null)
        }
      } else {
        val setter = underlying.methods.find(method => method.name == name + "_$eq" && method.parameters.length == 1)
        new ScalaProperty(this, name, field.get, getter.get, setter.get)
      }
    }
    
  })
  
  def findProperty(name : String) : ScalaProperty = properties.find(property => property.name == name).orNull


}
