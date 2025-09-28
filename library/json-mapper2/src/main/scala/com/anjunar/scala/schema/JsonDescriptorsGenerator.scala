package com.anjunar.scala.schema

import com.anjunar.scala.i18n.I18nResolver
import com.anjunar.scala.introspector.DescriptionIntrospector
import com.anjunar.scala.mapper.annotations.Converter
import com.anjunar.scala.schema.analyzer.*
import com.anjunar.scala.schema.builder.{ClassProperty, Schemas}
import com.anjunar.scala.schema.model.validators.{EmailValidator, NotBlankValidator, NotNullValidator, PastValidator, PatternValidator, SizeValidator}
import com.anjunar.scala.schema.model.{CollectionDescriptor, EnumDescriptor, NodeDescriptor, ObjectDescriptor}
import com.anjunar.scala.universe.introspector.{AbstractProperty, BeanIntrospector}
import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}
import com.fasterxml.jackson.annotation.{JsonSubTypes, JsonValue}
import jakarta.enterprise.inject.spi.CDI
import jakarta.persistence.Tuple
import jakarta.validation.constraints.{Email, NotBlank, NotNull, Past, Pattern, Size}

import scala.jdk.CollectionConverters.*

object JsonDescriptorsGenerator {

  private val analyzers: Array[AbstractAnalyzer] = Array(
    new PrimitiveAnalyser,
    new CollectionAnalyzer,
    new ArrayAnalyzer,
    new EnumAnalyzer,
    new ObjectAnalyzer
  )

  def generateObject(aClass: ResolvedClass, schema: Schemas, context: JsonDescriptorsContext): ObjectDescriptor = {

    val beanModel = DescriptionIntrospector.create(aClass)

    val descriptor = new ObjectDescriptor
    descriptor.`type` = aClass.raw.getSimpleName
    context.descriptor = descriptor
    val classSchema = schema.types(aClass.raw)

    beanModel.properties.foreach(property => {

      val typeMapping = classSchema.properties.get(property.name)

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
              collectionDescriptor.links.putAll(schemaDefinition.getLinks)
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

  private def findAnalyzer(aClass: ResolvedClass): AbstractAnalyzer = {
    val option = analyzers.find(analyzer => analyzer.analyze(aClass))
    if (option.isDefined) {
      option.get
    } else {
      throw new IllegalStateException("no Analyzer found : " + aClass.raw.getName)
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
      case email : Email =>
        descriptor.validators.put("Email", EmailValidator())
      case past : Past =>
        descriptor.validators.put("Past", PastValidator())
      case pattern : Pattern =>
        descriptor.validators.put("Pattern", PatternValidator(pattern.regexp()))
      case _ => {}
    }
  }

  private def generatePrimitive(property: AbstractProperty, propertyType: Class[?], schemaDefinition: ClassProperty) = {
    val nodeDescriptor = NodeDescriptor(
      schemaDefinition.title,
      schemaDefinition.description,
      schemaDefinition.widget,
      schemaDefinition.id,
      schemaDefinition.naming,
      schemaDefinition.hidden,
      propertyType.getSimpleName,
      schemaDefinition.step,
      schemaDefinition.getLinks)
    generateValidator(property, nodeDescriptor)
    nodeDescriptor
  }

  private def generateEnum(property: AbstractProperty, schemaDefinition: ClassProperty) = {
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
      schemaDefinition.title,
      schemaDefinition.description,
      schemaDefinition.widget,
      schemaDefinition.id,
      schemaDefinition.naming,
      schemaDefinition.hidden,
      property.propertyType.raw.getSimpleName,
      schemaDefinition.getLinks,
      enums.toList.asJava
    )
    generateValidator(property, enumDescriptor)
    enumDescriptor
  }

  private def generateObject(property: AbstractProperty, propertyType: ResolvedClass, schemaDefinition: ClassProperty, context: JsonDescriptorsContext): ObjectDescriptor = {
    val objectDescriptor = generateObject(propertyType, schemaDefinition.schemas, new JsonDescriptorsContext(context))
    objectDescriptor.title = schemaDefinition.title
    objectDescriptor.description = schemaDefinition.description
    objectDescriptor.widget = schemaDefinition.widget
    objectDescriptor.id = schemaDefinition.id
    objectDescriptor.name = schemaDefinition.naming
    objectDescriptor.hidden = schemaDefinition.hidden
    objectDescriptor.links.putAll(schemaDefinition.getLinks) 
    generateValidator(property, objectDescriptor)
    objectDescriptor
  }

  private def generateArray(property: AbstractProperty, propertyType: ResolvedClass, schemaDefinition: ClassProperty, context: JsonDescriptorsContext): CollectionDescriptor = {
    val descriptor = new CollectionDescriptor
    val collectionType = propertyType.typeArguments.head

    context.descriptor = descriptor

    descriptor.items = generateObject(collectionType, schemaDefinition.schemas, new JsonDescriptorsContext(context))
    descriptor.`type` = property.propertyType.raw.getSimpleName
    descriptor.title = schemaDefinition.title
    descriptor.description = schemaDefinition.description
    descriptor.widget = schemaDefinition.widget
    descriptor.id = schemaDefinition.id
    descriptor.name = schemaDefinition.naming
    descriptor.hidden = schemaDefinition.hidden
    descriptor.links.putAll(schemaDefinition.getLinks)
    generateValidator(property, descriptor)
    descriptor
  }

}
