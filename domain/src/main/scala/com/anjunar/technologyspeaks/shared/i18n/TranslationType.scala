package com.anjunar.technologyspeaks.shared.i18n

import com.anjunar.configuration.ObjectMapperContextResolver
import com.anjunar.technologyspeaks.shared.hashtag.HashTag
import com.fasterxml.jackson.annotation.JsonInclude.Include
import com.fasterxml.jackson.databind.{DeserializationFeature, ObjectMapper, SerializationFeature}
import com.fasterxml.jackson.module.scala.DefaultScalaModule
import org.hibernate.`type`.descriptor.WrapperOptions
import org.hibernate.engine.spi.SharedSessionContractImplementor
import org.hibernate.usertype.UserType
import org.postgresql.util.PGobject

import java.sql.{PreparedStatement, ResultSet, Types}
import java.util
import java.util.Objects

class TranslationType extends UserType[util.Set[Translation]] {

  private val objectMapper = ObjectMapperContextResolver.objectMapper

  override def getSqlType: Int = Types.OTHER

  override def returnedClass(): Class[util.Set[Translation]] = classOf[util.Set[Translation]]

  override def equals(x: util.Set[Translation], y: util.Set[Translation]): Boolean = Objects.equals(x, y)

  override def hashCode(x: util.Set[Translation]): Int = Objects.hashCode(x)

  override def nullSafeGet(rs: ResultSet, position: Int, options: WrapperOptions): util.Set[Translation] = {
    val json = rs.getString(position)
    if (json == null) return null
    val collectionType = objectMapper.getTypeFactory.constructCollectionType(classOf[util.Set[util.Set[Translation]]], classOf[Translation])
    objectMapper.readValue(json, collectionType)
  }

  override def nullSafeSet(st: PreparedStatement, value: util.Set[Translation], position: Int, options: WrapperOptions): Unit = {
    if (value == null) st.setNull(position, Types.OTHER)
    else {
      val pgObject = new PGobject()
      pgObject.setType("jsonb")
      pgObject.setValue(objectMapper.writeValueAsString(value))
      st.setObject(position, pgObject)
    }
  }

  override def deepCopy(value: util.Set[Translation]): util.Set[Translation] = {
    if (value == null) return null
    val collectionType = objectMapper.getTypeFactory.constructCollectionType(classOf[util.Set[util.Set[Translation]]], classOf[Translation])
    objectMapper.readValue(objectMapper.writeValueAsString(value), collectionType)
  }

  override def isMutable: Boolean = true

  override def disassemble(value: util.Set[Translation]): Serializable =
    deepCopy(value).asInstanceOf[Serializable]

  override def assemble(cached: Serializable, owner: Any): util.Set[Translation] =
    deepCopy(cached.asInstanceOf[util.Set[Translation]])
}