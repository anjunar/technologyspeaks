package com.anjunar.technologyspeaks.shared.editor

import com.anjunar.configuration.ObjectMapperContextResolver
import com.fasterxml.jackson.annotation.JsonInclude.Include
import com.fasterxml.jackson.databind.{DeserializationFeature, ObjectMapper, SerializationFeature}
import com.fasterxml.jackson.module.scala.DefaultScalaModule
import org.hibernate.`type`.descriptor.WrapperOptions
import org.hibernate.engine.spi.SharedSessionContractImplementor
import org.hibernate.usertype.UserType
import org.postgresql.util.PGobject

import java.sql.{PreparedStatement, ResultSet, Types}
import java.util.Objects

class RootType extends UserType[Root] {

  private val objectMapper = ObjectMapperContextResolver.objectMapper

  override def getSqlType: Int = Types.OTHER

  override def returnedClass(): Class[Root] = classOf[Root]

  override def equals(x: Root, y: Root): Boolean = Objects.equals(x, y)

  override def hashCode(x: Root): Int = Objects.hashCode(x)

  override def nullSafeGet(rs: ResultSet, position: Int, options: WrapperOptions): Root = {
    val json = rs.getString(position)
    if (json == null) null
    else objectMapper.readValue(json, classOf[Root])
  }

  override def nullSafeSet(st: PreparedStatement, value: Root, position: Int, options: WrapperOptions): Unit = {
    if (value == null) st.setNull(position, Types.OTHER)
    else {
      val pgObject = new PGobject()
      pgObject.setType("jsonb")
      pgObject.setValue(objectMapper.writeValueAsString(value))
      st.setObject(position, pgObject)
    }
  }

  override def deepCopy(value: Root): Root = {
    if (value == null) null
    else objectMapper.readValue(objectMapper.writeValueAsString(value), classOf[Root])
  }

  override def isMutable: Boolean = true

  override def disassemble(value: Root): Serializable =
    deepCopy(value).asInstanceOf[Serializable]

  override def assemble(cached: Serializable, owner: Any): Root =
    deepCopy(cached.asInstanceOf[Root])
}