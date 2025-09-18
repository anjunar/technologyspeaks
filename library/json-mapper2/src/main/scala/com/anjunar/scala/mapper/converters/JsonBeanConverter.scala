package com.anjunar.scala.mapper.converters

import com.anjunar.scala.introspector.{DescriptionIntrospector, DescriptorsModel}
import com.anjunar.scala.mapper.annotations.{Converter, Filter, IgnoreFilter}
import com.anjunar.scala.mapper.helper.JPAHelper.resolveMappings
import com.anjunar.scala.mapper.intermediate.model.{JsonBoolean, JsonNode, JsonObject, JsonString}
import com.anjunar.scala.mapper.{JsonContext, JsonConverterRegistry}
import com.anjunar.scala.schema.builder.{LinkContext, SchemaBuilder}
import com.anjunar.scala.schema.model.{Link, NodeDescriptor}
import com.anjunar.scala.universe.introspector.AbstractProperty
import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}
import com.fasterxml.jackson.annotation.{JsonSubTypes, JsonTypeInfo}
import com.google.common.reflect.TypeToken
import com.typesafe.scalalogging.Logger
import jakarta.persistence.Tuple
import jakarta.validation.ConstraintViolation

import java.util.concurrent.{CompletableFuture, CompletionStage}
import java.{lang, util}
import scala.collection.mutable

class JsonBeanConverter extends JsonAbstractConverter(TypeResolver.resolve(classOf[AnyRef])) {

  val log = Logger[JsonBeanConverter]

  override def toJson(outerInstance: Any, resolvedClass: ResolvedClass, context: JsonContext): JsonNode = {

    val properties = new mutable.LinkedHashMap[String, JsonNode]

    var aType: ResolvedClass = resolvedClass
    var instance: Any = outerInstance
    var schema = context.schema


    instance match {
      case tuple: Tuple =>
        schema = context.schema.tupleMapping.schemaBuilder
        val elements = tuple.getElements
        elements.forEach(element => {
          val javaType = element.getJavaType
          val alias = element.getAlias

          if (alias != null && alias.nonEmpty) {
            val clazz = TypeResolver.resolve(javaType)
            val value = tuple.get(alias)
            properties.put(alias, context.registry.find(clazz).toJson(value, clazz, context))
          } else {
            aType = TypeResolver.resolve(javaType)
            val value = tuple.get(alias)
            instance = value
          }
        })
      case _ => {}
    }

    val jsonTypeInfo = aType.findAnnotation(classOf[JsonTypeInfo])

    properties.put(if jsonTypeInfo == null then "$type" else jsonTypeInfo.property(), JsonString(instance.getClass.getSimpleName))
    val jsonObject = JsonObject(properties)

    val meta = new mutable.LinkedHashMap[String, JsonNode]()
    properties.put("$meta", JsonObject(meta))

    val resolvedType = TypeToken.of(aType.underlying).resolveType(instance.getClass).getType

    val beanModel = DescriptionIntrospector.createWithType(resolvedType)

    val typeMapping = schema.findInstanceMapping(instance.asInstanceOf[AnyRef])

    if (!(aType <:< TypeResolver.resolve(classOf[NodeDescriptor]))) {
      val nodeId = typeMapping.get("id")

      if (nodeId.isEmpty && beanModel.properties.exists(property => property.name == "id")) {
        log.warn("No Id for: " + aType.raw.getName)
      }
    }

    val ignoreFilter = instance.getClass.getAnnotation(classOf[IgnoreFilter])

    val beanProperties = if (context.parent != null && !context.parent.filter.isEmpty) {
      beanModel.properties.filter(property => context.parent.filter.contains(property.name))
    } else {
      beanModel.properties
    }

    for (property <- beanProperties) {

      val filter = property.findAnnotation(classOf[Filter])
      if (filter != null) {
        context.filter = filter.value()
      }

      val option = typeMapping.get(property.name)

      if (option.isDefined) {
        val propertySchema = option.get

        val propDescriptor = JsonObject(
          mutable.LinkedHashMap(
            "$type" -> JsonString("PropDescriptor"),
            "visible" -> JsonBoolean(propertySchema.visible),
            "writeable" -> JsonBoolean(propertySchema.writeable)
          )
        )

        val instanceDescriptor = meta
          .getOrElseUpdate("instance", JsonObject(mutable.LinkedHashMap()))
          .asInstanceOf[JsonObject]

        instanceDescriptor.value.put(property.name, propDescriptor)

        if (propertySchema.secured) {
          if (propertySchema.visible) {
            proceed(instance, context, properties, property, propertySchema.schemaBuilder)
          }
        } else {
          proceed(instance, context, properties, property, propertySchema.schemaBuilder)
        }
      } else {
        if (ignoreFilter != null) {
          proceed(instance, context, properties, property, schema)
        }
      }

    }


    val links = new mutable.LinkedHashMap[String, JsonNode]
    meta.put("links", JsonObject(links))

    val registry = context.registry

    val linkFactories = schema.findLinksByClass(TypeResolver.rawType(resolvedType)) ++ schema.findLinksByInstance(instance)

    linkFactories.foreach(linkFactory => {
      generateLinks(linkFactory, instance, context, links, registry)
    })

    if links.isEmpty then meta.remove("links")
    if meta.isEmpty then properties.remove("$meta") else meta.put("$type", JsonString("Meta"))

    jsonObject
  }

  private def proceed(instance: Any, context: JsonContext, properties: mutable.LinkedHashMap[String, JsonNode], property: AbstractProperty, propertySchema: SchemaBuilder) = {
    val registry = context.registry
    val converter = registry.find(property.propertyType)
    val value = property.get(instance.asInstanceOf[AnyRef])

    value match
      case null =>
      case bool: Boolean => if bool then processProperty(context, properties, property, converter, value, propertySchema)
      case string: String => if string.nonEmpty then processProperty(context, properties, property, converter, value, propertySchema)
      case _ => processProperty(context, properties, property, converter, value, propertySchema)
  }

  private def processProperty(context: JsonContext, properties: mutable.LinkedHashMap[String, JsonNode], property: AbstractProperty, converter: JsonAbstractConverter, value: Any, propertySchema: SchemaBuilder) = value match
    case collection: util.Collection[?] => if !collection.isEmpty then addProperty(context, properties, property, converter, value, propertySchema)
    case map: util.Map[?, ?] => if !map.isEmpty then addProperty(context, properties, property, converter, value, propertySchema)
    case _ => addProperty(context, properties, property, converter, value, propertySchema)

  private def addProperty(context: JsonContext, properties: mutable.LinkedHashMap[String, JsonNode], property: AbstractProperty, converter: JsonAbstractConverter, value: Any, propertySchema: SchemaBuilder) = {
    val jpaConverter = property.findAnnotation(classOf[Converter])

    if (jpaConverter == null) {
      val jsonNode = converter.toJson(value, property.propertyType, JsonContext(context, property.name, context.noValidation, propertySchema, context))
      properties.put(property.name, jsonNode)
    } else {
      val jpaConverterInstance = jpaConverter.value().getConstructor().newInstance()
      val jsonString = jpaConverterInstance.toJson(value)
      properties.put(property.name, JsonString(jsonString))
    }

  }

  private def generateLinks(linkFactory: (Any, LinkContext) => Unit, instance: Any, context: JsonContext, links: mutable.LinkedHashMap[String, JsonNode], registry: JsonConverterRegistry): Unit = {
    val linksResult = new mutable.HashMap[String, Link]()

    linkFactory(instance, (name: String, link: Link) => linksResult.put(name, link))

    for (link <- linksResult) {
      val converter = registry.find(TypeResolver.resolve(classOf[Link]))
      val node = converter.toJson(link._2, TypeResolver.resolve(classOf[Link]), JsonContext(context, link._1, context.noValidation, context.schema, context))

      links.put(link._1, node)
    }
  }

  override def toJava(jsonNode: JsonNode, instance: Any, aType: ResolvedClass, context: JsonContext): CompletionStage[Any] = jsonNode match
    case jsonObject: JsonObject =>
      val jsonSubTypes = aType.findDeclaredAnnotation(classOf[JsonSubTypes])
      val jsonTypeInfo = aType.findAnnotation(classOf[JsonTypeInfo])

      val beanModel = if (jsonSubTypes == null) DescriptionIntrospector.create(aType) else
        DescriptionIntrospector.createWithType(
          jsonSubTypes.value().find(subType => subType.value().getSimpleName == jsonObject.value(if jsonTypeInfo == null then "$type" else jsonTypeInfo.property()).value).get.value()
        )

      if (instance == null) {
        context.loader.load(jsonObject, beanModel.underlying)
          .thenCompose(entity => {
            processEntity(aType, context, beanModel, entity, jsonObject)
          })
      } else {
        processEntity(aType, context, beanModel, instance.asInstanceOf[AnyRef], jsonObject)
      }

    case _ => throw new IllegalStateException("Not a json Object")

  private def processEntity(aType: ResolvedClass, context: JsonContext, beanModel: DescriptorsModel, entity: AnyRef, jsonObject : JsonObject) : CompletionStage[Any] = {
    val schema = context.schema

    var propertyMapping = schema.findInstanceMapping(entity)

    if (propertyMapping.isEmpty) {
      propertyMapping = schema.findTypeMapping(aType.raw)
    }

    if (!(aType <:< TypeResolver.resolve(classOf[NodeDescriptor]))) {
      val nodeId = propertyMapping.get("id")

      if (nodeId.isEmpty && beanModel.properties.exists(property => property.name == "id")) {
        log.warn("No Id for: " + aType.raw.getName)
      }
    }

    val ignoreFilter = aType.findDeclaredAnnotation(classOf[IgnoreFilter])

    val futures = beanModel.properties
      .filter(property => {
        val option = propertyMapping.get(property.name)

        if (option.isDefined || ignoreFilter != null) {
          val value = option.get
          value.writeable
        } else {
          false
        }
      })
      .map(property => {

        val option = propertyMapping.get(property.name)

        val registry = context.registry
        val converter = registry.find(property.propertyType)
        val currentNode = jsonObject.value.get(property.name)

        val propertyValue: CompletionStage[Any] = if currentNode.isDefined then {
          val jpaConverter = property.findAnnotation(classOf[Converter])

          if (jpaConverter == null) {
            val newContext = JsonContext(context, property.name, context.noValidation, option.get.schemaBuilder, context)
            converter.toJava(currentNode.get, property.get(entity), property.propertyType, newContext)
          } else {
            val jpaConverterInstance = jpaConverter.value().getConstructor().newInstance()
            jpaConverterInstance.toJava(currentNode.get.value)
          }

        } else {
          property.propertyType.raw match {
            case aClass: Class[?] if classOf[lang.Boolean].isAssignableFrom(aClass) => CompletableFuture.completedFuture(false)
            case aClass: Class[?] if classOf[util.Set[?]].isAssignableFrom(aClass) => CompletableFuture.completedFuture(new util.HashSet[AnyRef]())
            case aClass: Class[?] if classOf[util.List[?]].isAssignableFrom(aClass) => CompletableFuture.completedFuture(new util.ArrayList[AnyRef]())
            case aClass: Class[?] if classOf[util.Map[?, ?]].isAssignableFrom(aClass) => CompletableFuture.completedFuture(new util.HashMap[AnyRef, AnyRef]())
            case _ => null
          }
        }

        propertyValue.thenCompose(propertyValue => {
          val violations: util.Set[ConstraintViolation[Any]] = if (context.noValidation) {
            new util.HashSet[ConstraintViolation[Any]]()
          } else {
            context.validator.validateValue(beanModel.underlying.raw.asInstanceOf[Class[Any]], property.name, propertyValue)
          }

          if (violations.isEmpty) {
            propertyValue match
              case collection: util.Collection[Any] =>
                val underlyingCollection = property.get(entity).asInstanceOf[util.Collection[Any]]
                underlyingCollection.clear()
                underlyingCollection.addAll(collection)
              case map: util.Map[Any, Any] =>
                val underlyingMap = property.get(entity).asInstanceOf[util.Map[Any, Any]]
                underlyingMap.clear()
                underlyingMap.putAll(map)
              case _ => property.set(entity, propertyValue)

            resolveMappings(entity, property, propertyValue)
            CompletableFuture.completedFuture(propertyValue)
          } else {
            context.violations.addAll(violations)
            CompletableFuture.completedFuture(null)
          }
        }).toCompletableFuture
      })

    CompletableFuture.allOf(futures.toSeq *)
      .thenApply(_ => entity)
  }
}
