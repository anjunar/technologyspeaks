package com.anjunar.vertx.webauthn

import com.anjunar.configuration.ObjectMapperContextResolver
import com.webauthn4j.converter.util.ObjectConverter
import com.webauthn4j.data.client.CollectedClientData
import org.hibernate.`type`.descriptor.WrapperOptions
import org.hibernate.usertype.UserType
import org.postgresql.util.PGobject

import java.sql.{PreparedStatement, ResultSet, Types}
import java.util.Objects

class CollectedClientDataType extends UserType[CollectedClientData] {

  private val objectMapper = new ObjectConverter()

  override def getSqlType: Int = Types.OTHER

  override def returnedClass(): Class[CollectedClientData] = classOf[CollectedClientData]

  override def equals(x: CollectedClientData, y: CollectedClientData): Boolean = Objects.equals(x, y)

  override def hashCode(x: CollectedClientData): Int = Objects.hashCode(x)

  override def nullSafeGet(rs: ResultSet, position: Int, options: WrapperOptions): CollectedClientData = {
    val json = rs.getString(position)
    if (json == null) null
    else objectMapper.getJsonConverter.readValue(json, classOf[CollectedClientData])
  }

  override def nullSafeSet(st: PreparedStatement, value: CollectedClientData, position: Int, options: WrapperOptions): Unit = {
    if (value == null) st.setNull(position, Types.OTHER)
    else {
      val pgObject = new PGobject()
      pgObject.setType("jsonb")
      pgObject.setValue(objectMapper.getJsonConverter.writeValueAsString(value))
      st.setObject(position, pgObject)
    }
  }

  override def deepCopy(value: CollectedClientData): CollectedClientData = {
    if (value == null) null
    else objectMapper.getJsonConverter.readValue(objectMapper.getJsonConverter.writeValueAsString(value), classOf[CollectedClientData])
  }

  override def isMutable: Boolean = true

  override def disassemble(value: CollectedClientData): Serializable =
    deepCopy(value).asInstanceOf[Serializable]

  override def assemble(cached: Serializable, owner: Any): CollectedClientData =
    deepCopy(cached.asInstanceOf[CollectedClientData])
}
