package com.anjunar.scala.mapper

import com.anjunar.scala.introspector.DescriptionIntrospector
import com.anjunar.scala.mapper.file.{File, FileContext}
import com.anjunar.scala.mapper.helper.JPAHelper
import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}
import com.anjunar.scala.universe.introspector.{BeanIntrospector, ScalaIntrospector}
import jakarta.persistence.{ManyToOne, OneToMany}
import jakarta.ws.rs.FormParam

import java.util.UUID
import java.util

class MultipartFormMapper {

  val registry = new MultipartFormConverterRegistry

  def toJava(entity : AnyRef, fields: Map[String, List[String]], files: Map[String, UploadedFile], aType: ResolvedClass, context: MultipartFormContext): AnyRef = {
    val converter = registry.find(aType)

    val model = DescriptionIntrospector.create(aType)

    model.properties.foreach(property => {

      val mapping = context.schema.findTypeMapping(aType.underlying)

      val propertyBuilder = mapping.get(property.name)

      if (propertyBuilder.isDefined) {

        if (propertyBuilder.get.writeable) {
          val converter = registry.find(property.propertyType)

          if (converter == null && ! classOf[File].isAssignableFrom(property.propertyType.raw)) {

            var value = property.get(entity).asInstanceOf[AnyRef]

            if (value == null) {
              value = context.loader.load(Map.empty, property.propertyType, Array())
            }

            toJava(value, fields, files, property.propertyType, MultipartFormContext(context, property.name, context.noValidation, propertyBuilder.get.schemaBuilder, context))

          } else {

            val formParam = property.findAnnotation(classOf[FormParam])

            if (formParam != null) {
              val fieldOption = fields.get(formParam.value())

              if (fieldOption.isDefined) {
                val value = converter.toJava(fieldOption.get, property.propertyType, context)

                val constraintViolations = context.validator.validateValue(aType.raw, property.name, value)

                context.violations.addAll(constraintViolations)

                if (constraintViolations.isEmpty) {

                  value match {
                    case collection: util.Collection[?] =>
                      val entityCollection = property.get(entity).asInstanceOf[util.Collection[AnyRef]]
                      entityCollection.clear()
                      entityCollection.addAll(collection)
                    case _ =>
                      property.set(entity, value)
                  }

                  JPAHelper.resolveMappings(entity, property, value)

                }
              }

              val fileOption = files.get(formParam.value())

              if (fileOption.isDefined) {

                val fileCollection = property.get(entity)

                if (classOf[util.Collection[?]].isAssignableFrom(property.propertyType.raw)) {
                  files.foreach((filename, uploaded) => {
                    val newFile = fileCollection.asInstanceOf[util.Collection[File]].stream().filter(file => file.name == filename)
                      .findFirst()
                      .orElseGet(() => {
                        val property = model.findProperty("files")
                        val oneToMany = property.findAnnotation(classOf[OneToMany])
                        val newFile = oneToMany.targetEntity().getConstructor().newInstance().asInstanceOf[File]
                        fileCollection.asInstanceOf[util.Collection[File]].add(newFile)
                        newFile
                      })
                    newFile.name = uploaded.filename
                    newFile.contentType = uploaded.contentType
                    newFile.data = uploaded.data
                  })
                } else {
                  files.foreach((filename, uploaded) => {
                    val manyToOne = property.findAnnotation(classOf[ManyToOne])
                    val newFile = manyToOne.targetEntity().getConstructor().newInstance().asInstanceOf[File]
                    newFile.name = uploaded.filename
                    newFile.contentType = uploaded.contentType
                    newFile.data = uploaded.data
                    property.set(entity, newFile)
                  })
                }

              }

              val deleteOption = fields.get(formParam.value() + ":delete")

              if (deleteOption.isDefined) {
                val fileCollection = property.get(entity).asInstanceOf[util.Collection[File]]

                val fileOption = fileCollection.stream().filter(file => file.id == UUID.fromString(deleteOption.get.head))
                  .findFirst()

                if (fileOption.isPresent) {
                  fileCollection.remove(fileOption.get())
                }
              }
            }
          }
        }
      }

    })
    
    entity
  }

}
