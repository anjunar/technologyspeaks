package com.anjunar.scala.introspector

import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.scala.universe.ResolvedClass
import com.anjunar.scala.universe.annotations.Annotated

import java.lang.annotation.Annotation

class DescriptorsModel(val underlying: ResolvedClass) extends Annotated {
  
  lazy val declaredProperties : Array[DescriptorProperty] = {
    underlying
      .declaredFields
      .filter(field => field.annotations.exists(annotation => annotation.annotationType() == classOf[PropertyDescriptor]))
      .map(field => {
        val setter = underlying.declaredMethods.find(method => method.name == field.name + "_$eq" && method.parameters.length == 1)
        val getter = underlying.declaredMethods.find(method => method.name == field.name && method.parameters.isEmpty)
        new DescriptorProperty(this, field.name, field, getter.orNull, setter.orNull)
      }) ++
    underlying
      .declaredMethods
      .filter(method => method.annotations.exists(annotation => annotation.annotationType() == classOf[PropertyDescriptor]))
      .map(getter => {
        val setter = underlying.declaredMethods.find(method => method.name == getter.name + "_$eq" && method.parameters.length == 1)
        val field = underlying.declaredFields.find(field => field.name == getter.name)
        new DescriptorProperty(this, getter.name, field.orNull, getter, setter.orNull)
      })
  }

  lazy val properties : Array[DescriptorProperty] = {
    underlying
      .fields
      .filter(field => field.annotations.exists(annotation => annotation.annotationType() == classOf[PropertyDescriptor]))
      .map(field => {
        val setter = underlying.methods.find(method => method.name == field.name + "_$eq" && method.parameters.length == 1)
        val getter = underlying.methods.find(method => method.name == field.name && method.parameters.isEmpty)
        new DescriptorProperty(this, field.name, field, getter.orNull, setter.orNull)
      }) ++
      underlying
        .methods
        .filter(method => method.annotations.exists(annotation => annotation.annotationType() == classOf[PropertyDescriptor]))
        .map(getter => {
          val setter = underlying.methods.find(method => method.name == getter.name + "_$eq" && method.parameters.length == 1)
          val field = underlying.fields.find(field => getter.name == field.name)
          new DescriptorProperty(this, getter.name, field.orNull, getter, setter.orNull)
        })
  }

  def findDeclaredProperty(name: String): DescriptorProperty = declaredProperties.find(property => property.name == name).orNull

  def findProperty(name: String): DescriptorProperty = properties.find(property => property.name == name).orNull

  override lazy val declaredAnnotations: Array[Annotation] = underlying.declaredAnnotations
  override lazy val annotations: Array[Annotation] = underlying.annotations


}
