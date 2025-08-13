package com.anjunar.scala.schema

import com.anjunar.scala.i18n.I18nResolver
import com.anjunar.scala.introspector.DescriptionIntrospector
import com.anjunar.scala.mapper.annotations.Converter
import com.anjunar.scala.schema.analyzer.*
import com.anjunar.scala.schema.builder.{PropertyBuilder, SchemaBuilder}
import com.anjunar.scala.schema.model.validators.{NotBlankValidator, NotNullValidator, SizeValidator}
import com.anjunar.scala.schema.model.{CollectionDescriptor, EnumDescriptor, NodeDescriptor, ObjectDescriptor}
import com.anjunar.scala.universe.introspector.{AbstractProperty, BeanIntrospector, ScalaIntrospector}
import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}
import com.fasterxml.jackson.annotation.{JsonSubTypes, JsonValue}
import jakarta.enterprise.inject.spi.CDI
import jakarta.persistence.Tuple
import jakarta.validation.constraints.{NotBlank, NotNull, Size}

import scala.jdk.CollectionConverters.*

object JsonDescriptorsGenerator {
  
  def i18nResolver : I18nResolver = CDI.current().select(classOf[I18nResolver]).get()

  private val analyzers: Array[AbstractAnalyzer] = Array(
    new PrimitiveAnalyser,
    new CollectionAnalyzer,
    new ArrayAnalyzer,
    new EnumAnalyzer,
    new ObjectAnalyzer
  )

  private def findAnalyzer(aClass: ResolvedClass): AbstractAnalyzer = {
    val option = analyzers.find(analyzer => analyzer.analyze(aClass))
    if (option.isDefined) {
      option.get
    } else {
      throw new IllegalStateException("no Analyzer found : " + aClass.raw.getName)
    }
  }

  def generateObject(aClass: ResolvedClass, schema: SchemaBuilder, context: JsonDescriptorsContext): ObjectDescriptor = {

    if (aClass.raw == classOf[Tuple]) {
      val schemaBuilder = schema.tupleMapping.schemaBuilder
      val head = schemaBuilder.typeMapping.head
      val objectDescriptor = generateObject(TypeResolver.resolve(head._1), schemaBuilder, context)

      schemaBuilder.primitiveMapping.foreach((clazz, builder) => {
        val nodeDescriptor = NodeDescriptor(
          i18nResolver.find(builder.title),
          builder.description,
          builder.widget,
          builder.id,
          builder.naming,
          false,
          builder.hidden,
          clazz.getSimpleName,
          builder.step,
          null)

        objectDescriptor.properties.put(builder.alias, nodeDescriptor)
      })

      objectDescriptor
    } else {
      val beanModel = DescriptionIntrospector.create(aClass)

      val descriptor = new ObjectDescriptor
      descriptor.`type` = aClass.raw.getSimpleName
      context.descriptor = descriptor

      beanModel.properties.foreach(property => {

        val typeMapping = schema.findTypeMapping(aClass.underlying).get(property.name)

        val option = if (typeMapping.isDefined) {
          val propertySchema = typeMapping.get
          if (propertySchema.secured) {
            if (propertySchema.visible) {
              typeMapping
            } else {
              None
            }
          } else {
            typeMapping
          }
        } else {
          None
        }

        if (option.isDefined) {
          val schemaDefinition = option.get

          val converter = property.findAnnotation(classOf[Converter])

          val propertyType = property.propertyType

          if (converter == null) {
            findAnalyzer(propertyType) match
              case p: PrimitiveAnalyser =>
                val nodeDescriptor = generatePrimitive(property, propertyType.raw, schemaDefinition)
                descriptor.properties.put(property.name, nodeDescriptor)
              case e: EnumAnalyzer =>
                val enumDescriptor = generateEnum(property, schemaDefinition)
                descriptor.properties.put(property.name, enumDescriptor)
              case c: CollectionAnalyzer =>
                val collectionDescriptor = generateArray(property, propertyType, schemaDefinition, new JsonDescriptorsContext(context))
                collectionDescriptor.links.putAll(schemaDefinition.links.asJava)
                descriptor.properties.put(property.name, collectionDescriptor)
              case c: ArrayAnalyzer =>
                val collectionDescriptor = generatePrimitive(property, propertyType.raw, schemaDefinition)
                descriptor.properties.put(property.name, collectionDescriptor)
              case o: ObjectAnalyzer =>
                val objectDescriptor = generateObject(property, propertyType, schemaDefinition, new JsonDescriptorsContext(context))
                descriptor.properties.put(property.name, objectDescriptor)
          } else {
            descriptor.properties.put(property.name, generatePrimitive(property, classOf[String], schemaDefinition))
          }
        }
      })

      val jsonSubTypes = aClass.findDeclaredAnnotation(classOf[JsonSubTypes])
      if (jsonSubTypes != null) {

        val backReference = context.findClass(aClass.raw)

        jsonSubTypes
          .value()
          .foreach(subType => descriptor.oneOf.add(JsonDescriptorsGenerator.generateObject(TypeResolver.resolve(subType.value()), schema, new JsonDescriptorsContext(context))))
      }

      descriptor
    }

  }

  private def generateValidator(property: AbstractProperty, descriptor: NodeDescriptor): Unit = {
    property.annotations.foreach {
      case size: Size =>
        descriptor.validators.put("Size", SizeValidator(size.min(), size.max()))
      case notBlank: NotBlank =>
        descriptor.validators.put("NotBlank", NotBlankValidator())
      case notNull: NotNull =>
        descriptor.validators.put("NotNull", NotNullValidator())
      case _ => {}
    }
  }

  private def generatePrimitive(property: AbstractProperty, propertyType: Class[?], schemaDefinition: PropertyBuilder[?]) = {
    val nodeDescriptor = NodeDescriptor(
      i18nResolver.find(schemaDefinition.title),
      schemaDefinition.description,
      schemaDefinition.widget,
      schemaDefinition.id,
      schemaDefinition.naming,
      schemaDefinition.writeable,
      schemaDefinition.hidden,
      propertyType.getSimpleName,
      schemaDefinition.step,
      schemaDefinition.links.asJava)
    generateValidator(property, nodeDescriptor)
    nodeDescriptor
  }

  private def generateEnum(property: AbstractProperty, schemaDefinition: PropertyBuilder[?]) = {
    val constants: Array[Enum[?]] = property.propertyType.raw.getEnumConstants.asInstanceOf[Array[Enum[?]]]
    val enums = constants.map(constant => {
      val enumClass = TypeResolver.resolve(constant.getClass)
      val option = enumClass.declaredMethods.find(method => method.findDeclaredAnnotation(classOf[JsonValue]) != null)
      if (option.isDefined) {
        val method = option.get
        val value = method.invoke(constant)
        value.asInstanceOf[String]
      } else {
        constant.name()
      }
    })
    val enumDescriptor = EnumDescriptor(
      i18nResolver.find(schemaDefinition.title),
      schemaDefinition.description,
      schemaDefinition.widget,
      schemaDefinition.id,
      schemaDefinition.naming,
      schemaDefinition.writeable,
      schemaDefinition.hidden,
      property.propertyType.raw.getSimpleName,
      schemaDefinition.links.asJava,
      enums.toList.asJava
    )
    generateValidator(property, enumDescriptor)
    enumDescriptor
  }

  private def generateObject(property: AbstractProperty, propertyType: ResolvedClass, schemaDefinition: PropertyBuilder[?], context: JsonDescriptorsContext): ObjectDescriptor = {
    val objectDescriptor = generateObject(propertyType, schemaDefinition.schemaBuilder, new JsonDescriptorsContext(context))
    objectDescriptor.title = i18nResolver.find(schemaDefinition.title)
    objectDescriptor.description = schemaDefinition.description
    objectDescriptor.widget = schemaDefinition.widget
    objectDescriptor.id = schemaDefinition.id
    objectDescriptor.name = schemaDefinition.naming
    objectDescriptor.writeable = schemaDefinition.writeable
    objectDescriptor.hidden = schemaDefinition.hidden
    objectDescriptor.links = schemaDefinition.links.asJava
    generateValidator(property, objectDescriptor)
    objectDescriptor
  }

  private def generateArray(property: AbstractProperty, propertyType: ResolvedClass, schemaDefinition: PropertyBuilder[?], context: JsonDescriptorsContext): CollectionDescriptor = {
    val descriptor = new CollectionDescriptor
    val collectionType = propertyType.typeArguments.head

    context.descriptor = descriptor

    descriptor.items = generateObject(collectionType, schemaDefinition.schemaBuilder, new JsonDescriptorsContext(context))
    descriptor.`type` = property.propertyType.raw.getSimpleName
    descriptor.title = i18nResolver.find(schemaDefinition.title)
    descriptor.description = schemaDefinition.description
    descriptor.widget = schemaDefinition.widget
    descriptor.id = schemaDefinition.id
    descriptor.name = schemaDefinition.naming
    descriptor.writeable = schemaDefinition.writeable
    descriptor.hidden = schemaDefinition.hidden
    descriptor.links = schemaDefinition.links.asJava
    generateValidator(property, descriptor)
    descriptor
  }

}
