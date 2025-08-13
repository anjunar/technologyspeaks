package com.anjunar.scala.mapper

import com.anjunar.scala.mapper.annotations.{JsonSchema, NoValidation}
import com.anjunar.scala.mapper.exceptions.{ValidationException, ValidationViolation}
import com.anjunar.scala.mapper.intermediate.model.{JsonArray, JsonNode, JsonObject}
import com.anjunar.scala.mapper.loader.JsonEntityLoader
import com.anjunar.scala.mapper.{JsonContext, JsonConverterRegistry, JsonMapper}
import com.anjunar.scala.schema.{JsonDescriptorsContext, JsonDescriptorsGenerator}
import com.anjunar.scala.schema.builder.{EntityJSONSchema, EntitySchemaBuilder, SchemaBuilderProvider}
import com.anjunar.scala.schema.model.{Link, ObjectDescriptor}
import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}
import jakarta.inject.Inject
import jakarta.validation.{ConstraintViolation, ValidatorFactory}
import jakarta.ws.rs.core.{MediaType, MultivaluedMap}
import jakarta.ws.rs.ext.{MessageBodyReader, MessageBodyWriter, Provider}
import jakarta.ws.rs.{Consumes, Produces, WebApplicationException}

import java.io.{IOException, InputStream, OutputStream}
import java.lang.annotation.Annotation
import java.lang.reflect.Type
import java.nio.charset.StandardCharsets
import java.util
import java.util.UUID
import scala.collection.mutable
import scala.collection.mutable.ListBuffer
import scala.compiletime.uninitialized
import scala.jdk.CollectionConverters.*


@Provider
@Consumes(Array("application/json", "application/*+json", "text/json"))
@Produces(Array("application/json", "application/*+json", "text/json"))
class JsonProvider extends MessageBodyReader[AnyRef] with MessageBodyWriter[AnyRef] with EntitySecurity {

  val jsonMapper = new JsonMapper()

  val registry = new JsonConverterRegistry()

  var validatorFactory: ValidatorFactory = uninitialized

  var entityLoader : JsonEntityLoader = uninitialized

  var schemaProvider : SchemaBuilderProvider = uninitialized

  override def isReadable(aClass: Class[?], javaType: Type, annotations: Array[Annotation], mediaType: MediaType): Boolean = {
    annotations.exists(annotation => annotation.annotationType() == classOf[JsonSchema])
  }

  @throws[IOException]
  @throws[WebApplicationException]
  override def readFrom(aClass: Class[AnyRef], javaTypeRaw: Type, annotations: Array[Annotation], mediaType: MediaType, multivaluedMap: MultivaluedMap[String, String], inputStream: InputStream): AnyRef = {

    val resolvedClass = TypeResolver.resolve(javaTypeRaw)

    val jsonString = new String(inputStream.readAllBytes())

    val jsonSchemaAnnotation = annotations
      .find(annotation => annotation.annotationType() == classOf[JsonSchema])
      .get
      .asInstanceOf[JsonSchema]

    val noValidation: Boolean = annotations.exists(annotation => annotation.annotationType() == classOf[NoValidation])

    val jsonSchema : EntityJSONSchema[Any] = jsonSchemaAnnotation.value().getConstructor().newInstance().asInstanceOf[EntityJSONSchema[Any]]

    val jsonNode = jsonMapper.toJsonObjectForJava(jsonString)

    def processJsonObject(jsonObject: JsonObject, aType : ResolvedClass) = {
      val entity = entityLoader.load(jsonObject, aType, annotations)

      val schemaBuilder = jsonSchema.build(entity, aType.underlying)

      val context = new JsonContext(null, null, noValidation, validatorFactory.getValidator, registry, schemaBuilder, new ListBuffer[Link], entityLoader)

      val value = jsonMapper.toJava(jsonObject, aType, context)

      checkRestrictionAndViolations(annotations, context, value)
    }

    jsonNode match {
      case jsonObject: JsonObject =>
        processJsonObject(jsonObject, TypeResolver.resolve(javaTypeRaw))
      case jsonArray : JsonArray =>
        jsonArray.value.map(node => processJsonObject(node.asInstanceOf[JsonObject], TypeResolver.resolve(javaTypeRaw).typeArguments(0))).toList.asJava
    }
  }

  override def isWriteable(aClass: Class[?], javaType: Type, annotations: Array[Annotation], mediaType: MediaType): Boolean = {
    if annotations == null then false else annotations.exists(annotation => annotation.annotationType() == classOf[JsonSchema])
  }

  @throws[IOException]
  @throws[WebApplicationException]
  override def writeTo(element: AnyRef, aClass: Class[?], javaTypeRaw: Type, annotations: Array[Annotation], mediaType: MediaType, multivaluedMap: MultivaluedMap[String, AnyRef], outputStream: OutputStream): Unit = {

    val resolvedClass = TypeResolver.resolve(javaTypeRaw)

    val jsonSchemaAnnotation = annotations
      .find(annotation => annotation.annotationType() == classOf[JsonSchema])
      .get
      .asInstanceOf[JsonSchema]

    val validator = validatorFactory.getValidator

    val jsonSchema = jsonSchemaAnnotation.value().getConstructor().newInstance().asInstanceOf[EntityJSONSchema[Any]]

    val schema = jsonSchema.build(element, javaTypeRaw)

    schemaProvider.builder.typeMapping.foreachEntry((clazz, builder) => {
      schema.findEntitySchemaDeepByClass(clazz).foreach(b => b.links = builder.links)
    })
    schemaProvider.builder.instanceMapping.foreachEntry((instance, builder) => {
      schema.findEntitySchemaDeepByInstance(instance).foreach(b => b.links = builder.links)
    })

    val context = new JsonContext(null, null, true, validator, registry, schema, new ListBuffer[Link], null)

    val jsonObject = jsonMapper.toJson(element, resolvedClass, context)

    val properties = jsonObject.value
    val objectDescriptor = JsonDescriptorsGenerator.generateObject(resolvedClass, schema, new JsonDescriptorsContext(null))

    val contextForDescriptor = new JsonContext(null, null, true, validatorFactory.getValidator, registry, schema, new ListBuffer[Link], null)
    val jsonDescriptor = jsonMapper.toJson(objectDescriptor, TypeResolver.resolve(classOf[ObjectDescriptor]), contextForDescriptor)

    properties.put("$descriptors", jsonDescriptor)

    val string  = jsonMapper.toJsonObjectForJson(jsonObject)

    outputStream.write(string .getBytes(StandardCharsets.UTF_8))
  }
}
