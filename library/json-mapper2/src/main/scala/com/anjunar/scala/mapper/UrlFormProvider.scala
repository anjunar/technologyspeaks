package com.anjunar.scala.mapper

import com.anjunar.scala.mapper.annotations.{JsonSchema, NoValidation}
import com.anjunar.scala.mapper.loader.FormEntityLoader
import com.anjunar.scala.schema.builder.EntityJSONSchema
import com.anjunar.scala.universe.TypeResolver
import jakarta.inject.Inject
import jakarta.validation.ValidatorFactory
import jakarta.ws.rs.Consumes
import jakarta.ws.rs.core.{MediaType, MultivaluedMap}
import jakarta.ws.rs.ext.{MessageBodyReader, Provider}
import org.apache.commons.fileupload.MultipartStream

import java.io.{BufferedReader, ByteArrayOutputStream, InputStream, InputStreamReader}
import java.lang.annotation.Annotation
import java.lang.reflect.Type
import java.net.URLDecoder
import java.nio.charset.StandardCharsets
import java.util.regex.Pattern
import scala.collection.mutable
import scala.compiletime.uninitialized
import scala.jdk.CollectionConverters.*

@Provider
@Consumes(Array(MediaType.APPLICATION_FORM_URLENCODED))
class UrlFormProvider extends MessageBodyReader[AnyRef] with EntitySecurity {
  
  val mapper = new MultipartFormMapper

  var validatorFactory: ValidatorFactory = uninitialized

  var entityLoader: FormEntityLoader = uninitialized

  override def isReadable(`type`: Class[?], genericType: Type, annotations: Array[Annotation], mediaType: MediaType): Boolean = {
    annotations.exists(annotation => annotation.annotationType() == classOf[JsonSchema])
  }

  override def readFrom(`type`: Class[AnyRef], genericType: Type, annotations: Array[Annotation], mediaType: MediaType, httpHeaders: MultivaluedMap[String, String], entityStream: InputStream): AnyRef = {

    val body = new BufferedReader(new InputStreamReader(entityStream, StandardCharsets.UTF_8))
      .lines().iterator().asScala.mkString("\n")

    val fields = parseForm(body)

    val jsonSchemaAnnotation = annotations
      .find(annotation => annotation.annotationType() == classOf[JsonSchema])
      .get
      .asInstanceOf[JsonSchema]

    val noValidation: Boolean = annotations.exists(annotation => annotation.annotationType() == classOf[NoValidation])

    val jsonSchema: EntityJSONSchema[Any] = jsonSchemaAnnotation.value().getConstructor().newInstance().asInstanceOf[EntityJSONSchema[Any]]

    val entity = entityLoader.load(fields, TypeResolver.resolve(`type`), annotations)

    val schemaBuilder = jsonSchema.build(entity, `type`)

    val context = MultipartFormContext(null, null, noValidation, validatorFactory.getValidator, null, schemaBuilder, mutable.ListBuffer(), entityLoader)

    val value = mapper.toJava(entity, fields, Map.empty, TypeResolver.resolve(genericType), context)

    checkRestrictionAndViolations(annotations, context, value)
  }

  private def parseForm(body: String): Map[String, List[String]] = {
    body.split("&").toList.flatMap { pair =>
        pair.split("=", 2) match {
          case Array(k, v) =>
            Some(
              URLDecoder.decode(k, StandardCharsets.UTF_8) ->
              URLDecoder.decode(v, StandardCharsets.UTF_8)
            )
          case _ => None
        }
      }.groupBy(_._1)
      .map { case (key, pairs) => key -> pairs.map(_._2) }
  }
}
