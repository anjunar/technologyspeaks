package com.anjunar.scala.introspector

import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}
import com.anjunar.scala.universe.introspector.AbstractProperty
import com.anjunar.scala.universe.members.{ResolvedField, ResolvedMethod}
import com.google.common.reflect
import com.google.common.reflect.{TypeParameter, TypeToken}
import jakarta.persistence.{ManyToMany, OneToMany}

class DescriptorProperty(val owner: DescriptorsModel,
                         name: String,
                         field: ResolvedField,
                         getter: ResolvedMethod,
                         setter: ResolvedMethod) extends AbstractProperty(name, field, getter, setter) {

  override def propertyType: ResolvedClass = {
    val oneToMany = findAnnotation(classOf[OneToMany])
    if (oneToMany != null && oneToMany.targetEntity().getSimpleName != "void") {
      TypeResolver.resolve(TypeTokenBuilder.parameterizedType(super.propertyType.raw, TypeToken.of(oneToMany.targetEntity())).getType)
    } else {
      val manyToMany = findAnnotation(classOf[ManyToMany])
      if (manyToMany != null && manyToMany.targetEntity().getSimpleName != "void") {
        TypeResolver.resolve(TypeTokenBuilder.parameterizedType(super.propertyType.raw, TypeToken.of(manyToMany.targetEntity())).getType)
      } else {
        super.propertyType
      }
    }

  }

}
