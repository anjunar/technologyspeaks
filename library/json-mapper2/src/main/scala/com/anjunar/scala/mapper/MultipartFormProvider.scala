package com.anjunar.scala.mapper

import com.anjunar.scala.mapper.annotations.{JsonSchema, NoValidation}
import com.anjunar.scala.mapper.exceptions.{ValidationException, ValidationViolation}
import com.anjunar.scala.mapper.loader.FormEntityLoader
import com.anjunar.scala.schema.builder.EntityJSONSchema
import com.anjunar.scala.universe.TypeResolver
import jakarta.inject.Inject
import jakarta.validation.ValidatorFactory
import jakarta.ws.rs.Consumes
import jakarta.ws.rs.core.{MediaType, MultivaluedMap}
import jakarta.ws.rs.ext.{MessageBodyReader, Provider}
import org.apache.commons.fileupload.MultipartStream

import java.io.{ByteArrayOutputStream, InputStream}
import java.lang.annotation.Annotation
import java.lang.reflect.Type
import java.nio.charset.StandardCharsets
import java.util.regex.Pattern
import scala.collection.mutable
import scala.compiletime.uninitialized

@Provider
@Consumes(Array(MediaType.MULTIPART_FORM_DATA))
class MultipartFormProvider extends MessageBodyReader[AnyRef] with EntitySecurity {

  val mapper = new MultipartFormMapper

  var validatorFactory: ValidatorFactory = uninitialized

  var entityLoader: FormEntityLoader = uninitialized

  override def isReadable(`type`: Class[?], genericType: Type, annotations: Array[Annotation], mediaType: MediaType): Boolean = {
    annotations.exists(annotation => annotation.annotationType() == classOf[JsonSchema])
  }

  override def readFrom(`type`: Class[AnyRef], genericType: Type, annotations: Array[Annotation], mediaType: MediaType, httpHeaders: MultivaluedMap[String, String], entityStream: InputStream): AnyRef = {
    val boundary = extractBoundary(mediaType)
    val multipartStream = new MultipartStream(entityStream, boundary.getBytes(), 4096, null)

    var fields = Map.empty[String, List[String]]
    var files = Map.empty[String, UploadedFile]

    var nextPart = multipartStream.skipPreamble()

    while (nextPart) {
      val partData = new ByteArrayOutputStream()
      val headersStr = multipartStream.readHeaders()
      val partHeaders = parsePartHeaders(headersStr)

      val contentDisposition = partHeaders.getOrElse("Content-Disposition", "")
      val name = extractFieldName(contentDisposition)
      val filename = extractFileName(contentDisposition)

      multipartStream.readBodyData(partData)

      if (filename.nonEmpty) {
        val contentType = partHeaders.getOrElse("Content-Type", "application/octet-stream")
        files += name -> UploadedFile(filename, contentType, partData.toByteArray)
      } else {
        val value = partData.toString(StandardCharsets.UTF_8)
        if (value.nonEmpty) {
          fields += name -> (fields.getOrElse(name, List.empty) :+ value)  
        }
      }

      nextPart = multipartStream.readBoundary()
    }

    val jsonSchemaAnnotation = annotations
      .find(annotation => annotation.annotationType() == classOf[JsonSchema])
      .get
      .asInstanceOf[JsonSchema]

    val noValidation: Boolean = annotations.exists(annotation => annotation.annotationType() == classOf[NoValidation])

    val jsonSchema: EntityJSONSchema[Any] = jsonSchemaAnnotation.value().getConstructor().newInstance().asInstanceOf[EntityJSONSchema[Any]]

    val entity = entityLoader.load(fields, TypeResolver.resolve(`type`), annotations)

    val schemaBuilder = jsonSchema.build(entity, `type`)

    val context = MultipartFormContext(null, null, noValidation, validatorFactory.getValidator, null, schemaBuilder, mutable.ListBuffer(), entityLoader)

    val value = mapper.toJava(entity, fields, files, TypeResolver.resolve(genericType), context)

    checkRestrictionAndViolations(annotations, context, value)
  }

  private def extractBoundary(mediaType: MediaType): String = {
    val boundary = Option(mediaType.getParameters).map(_.get("boundary")).orNull
    if (boundary == null) throw new IllegalArgumentException("No boundary in Content-Type")
    boundary
  }

  private def parsePartHeaders(raw: String): Map[String, String] = {
    raw.split("\r\n").collect {
      case line if line.contains(":") =>
        val idx = line.indexOf(":")
        line.substring(0, idx).trim -> line.substring(idx + 1).trim
    }.toMap
  }

  private def extractFieldName(contentDisposition: String): String = {
    val matcher = Pattern.compile("""name="([^"]+)"""").matcher(contentDisposition)
    if (matcher.find()) matcher.group(1) else null
  }

  private def extractFileName(contentDisposition: String): String = {
    val matcher = Pattern.compile("""filename="([^"]*)"""").matcher(contentDisposition)
    if (matcher.find()) matcher.group(1) else ""
  }
}
