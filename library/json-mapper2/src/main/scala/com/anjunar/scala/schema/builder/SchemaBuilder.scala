package com.anjunar.scala.schema.builder

import com.google.common.reflect.TypeToken

import java.lang.reflect.Type
import scala.collection.mutable
import scala.compiletime.uninitialized

class SchemaBuilder(var table: Boolean = false, val parent: SchemaBuilder = null) {

  val typeMapping = new mutable.LinkedHashMap[Type, EntitySchemaBuilder[?]]

  val instanceMapping = new mutable.LinkedHashMap[Any, EntitySchemaBuilder[?]]

  val primitiveMapping = new mutable.LinkedHashMap[Class[?], PrimitiveSchemaBuilder[?]]

  var tupleMapping: TupleSchemaBuilder = uninitialized

  def forLinks[C](aClass: Class[C], link: (C, LinkContext) => Unit): SchemaBuilder = {
    val option = typeMapping.get(aClass)

    if (option.isDefined) {
      val value = option.get.asInstanceOf[EntitySchemaBuilder[C]]
      value.withLinks(link)
    } else {
      val value = new EntitySchemaBuilder[C](aClass, table, this)
      value.withLinks(link)
      typeMapping.put(aClass, value)
    }

    this
  }

  def forLinks[C](instance: C, aClass: Class[C], link: (C, LinkContext) => Unit): SchemaBuilder = {
    val instanceOption = instanceMapping.get(instance)

    if (instanceOption.isDefined) {
      val value = instanceOption.get.asInstanceOf[EntitySchemaBuilder[C]]
      value.withLinks(link)
    } else {
      val value = new EntitySchemaBuilder[C](instance.getClass.asInstanceOf[Class[C]], table, this)
      value.withLinks(link)
      instanceMapping.put(instance, value)
    }

    this
  }

  def forType[C](aClass: Type, builder: EntitySchemaBuilder[C] => Unit): SchemaBuilder = {

    val option = typeMapping.get(aClass)

    if (option.isDefined) {
      val value = option.get.asInstanceOf[EntitySchemaBuilder[C]]
      builder(value)
    } else {
      val value = new EntitySchemaBuilder[C](aClass, table, this)
      builder(value)
      typeMapping.put(aClass, value)
    }

    this
  }

  def forInstance[C](instance: C, aClass: Class[C], builder: EntitySchemaBuilder[C] => Unit): SchemaBuilder = {
    val instanceOption = instanceMapping.get(instance)

    if (instanceOption.isDefined) {
      val value = instanceOption.get.asInstanceOf[EntitySchemaBuilder[C]]
      builder(value)
    } else {
      val value = new EntitySchemaBuilder[C](instance.getClass.asInstanceOf[Class[C]], table, this)
      builder(value)
      instanceMapping.put(instance, value)
    }

    this
  }

  def forTuple[C](builder: TupleSchemaBuilder => Unit): SchemaBuilder = {
    tupleMapping = new TupleSchemaBuilder(this)
    builder(tupleMapping)
    this
  }

  def forPrimitive[C](aClass: Class[C], builder: PrimitiveSchemaBuilder[C] => Unit): SchemaBuilder = {

    val option = primitiveMapping.get(aClass)

    if (option.isDefined) {
      val value = option.get.asInstanceOf[PrimitiveSchemaBuilder[C]]
      builder(value)
    } else {
      val value = new PrimitiveSchemaBuilder[C](aClass, table, this)
      builder(value)
      primitiveMapping.put(aClass, value)
    }

    this

  }

  def findTypeMapping(aClass: Type): Map[String, PropertyBuilder[?]] = {
    val mapping = typeMapping
      .filter(entry => TypeToken.of(entry._1).isSupertypeOf(aClass))
      .flatMap(entry => entry._2.mapping)
      .toMap

    if (mapping.isEmpty && parent != null) {
      parent.findTypeMapping(aClass)
    } else {
      mapping
    }
  }

  def findInstanceMapping(instance: AnyRef): Map[String, PropertyBuilder[?]] = {
    val propertyMapping = instanceMapping
      .filter(entry => entry._1 == instance)
      .flatMap(entry => entry._2.mapping)
      .toMap

    if (propertyMapping.isEmpty && parent != null) {
      parent.findInstanceMapping(instance)
    } else {
      propertyMapping
    }
  }

  def findEntitySchemaDeepByInstance(instance: AnyRef): EntitySchemaBuilder[?] = {
    instanceMapping.get(instance) match {
      case Some(schema) =>
        schema
      case None =>
        val nested = instanceMapping.values.iterator
          .flatMap(_.mapping.values)
          .map(_.schemaBuilder.findEntitySchemaDeepByInstance(instance))
          .find(_ != null)

        nested.orNull
    }
  }

  def findLinksByClass(aClass: Class[?]): mutable.Iterable[(Any, LinkContext) => Unit] = {
    typeMapping
      .filter(entry => TypeToken.of(entry._1).getRawType.isAssignableFrom(aClass) && entry._2.links != null)
      .map(entry => entry._2.links)
      .asInstanceOf[mutable.Iterable[(Any, LinkContext) => Unit]]
  }

  def findLinksByInstance(instance: Any): mutable.Iterable[(Any, LinkContext) => Unit] = {
    instanceMapping
      .filter((i, builder) => i == instance && builder.links != null)
      .map(entry => entry._2.links)
      .asInstanceOf[mutable.Iterable[(Any, LinkContext) => Unit]]
  }


}
