package com.anjunar.scala.schema.builder

import java.util
import jakarta.persistence.Tuple

import scala.collection.mutable

class TupleSchemaBuilder(val parent : SchemaBuilder) {
  
  val schemaBuilder : SchemaBuilder = new SchemaBuilder(parent.table, parent)
  
  val types : mutable.HashSet[Class[?]] = new mutable.HashSet[Class[_]]()
  
  def forPrimitive[D](aClass : Class[D], builder : PrimitiveSchemaBuilder[D] => Unit) : TupleSchemaBuilder = {
    schemaBuilder.forPrimitive(aClass, builder)
    types.add(aClass)
    this
  }
  
  def forType[D](aClass: Class[D], builder: EntitySchemaBuilder[D] => Unit): TupleSchemaBuilder = {
    schemaBuilder.forType(aClass, builder)
    types.add(aClass)
    this
  }

  def forInstance[D](instances: util.Collection[Tuple], aClass: Class[D], builder: D => EntitySchemaBuilder[D] => Unit): TupleSchemaBuilder = {
    schemaBuilder.table = true
    types.add(aClass)
    instances.forEach(instance => {
      val alias = instance.get(0, aClass)
      schemaBuilder.forInstance(alias, aClass, builder(alias))
    })
    this
  }


}
