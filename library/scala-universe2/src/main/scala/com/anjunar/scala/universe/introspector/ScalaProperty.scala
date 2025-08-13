package com.anjunar.scala.universe.introspector

import com.anjunar.scala.universe.members.{ResolvedField, ResolvedMethod}

class ScalaProperty(val owner: ScalaModel,
                    name: String,
                    field: ResolvedField,
                    getter: ResolvedMethod,
                    setter: ResolvedMethod) extends AbstractProperty(name, field, getter, setter) {

}
