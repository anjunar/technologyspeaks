
package com.anjunar.vertx.webauthn

import com.anjunar.configuration.ObjectMapperContextResolver
import com.fasterxml.jackson.core.`type`.TypeReference
import com.webauthn4j.converter.util.ObjectConverter
import com.webauthn4j.data.AuthenticatorTransport
import org.hibernate.`type`.descriptor.WrapperOptions
import org.hibernate.usertype.UserType
import org.postgresql.util.PGobject

import java.sql.{PreparedStatement, ResultSet, Types}
import java.util.Objects
import java.util

class AuthenticatorTransportType extends UserType[util.Set[AuthenticatorTransport]] {

  private val objectMapper = new ObjectConverter()

  override def getSqlType: Int = Types.OTHER

  override def returnedClass(): Class[util.Set[AuthenticatorTransport]] = classOf[util.Set[AuthenticatorTransport]]

  override def equals(x: util.Set[AuthenticatorTransport], y: util.Set[AuthenticatorTransport]): Boolean = Objects.equals(x, y)

  override def hashCode(x: util.Set[AuthenticatorTransport]): Int = Objects.hashCode(x)

  override def nullSafeGet(rs: ResultSet, position: Int, options: WrapperOptions): util.Set[AuthenticatorTransport] = {
    val json = rs.getString(position)
    if (json == null) null
    else {
      objectMapper.getJsonConverter.readValue(json, new TypeReference[util.Set[AuthenticatorTransport]]() {})
    }
  }

  override def nullSafeSet(st: PreparedStatement, value: util.Set[AuthenticatorTransport], position: Int, options: WrapperOptions): Unit = {
    if (value == null) st.setNull(position, Types.OTHER)
    else {
      val pgObject = new PGobject()
      pgObject.setType("jsonb")
      pgObject.setValue(objectMapper.getJsonConverter.writeValueAsString(value))
      st.setObject(position, pgObject)
    }
  }

  override def deepCopy(value: util.Set[AuthenticatorTransport]): util.Set[AuthenticatorTransport] = {
    if (value == null) null
    else objectMapper.getJsonConverter.readValue(objectMapper.getJsonConverter.writeValueAsString(value), new TypeReference[util.Set[AuthenticatorTransport]]() {})
  }

  override def isMutable: Boolean = true

  override def disassemble(value: util.Set[AuthenticatorTransport]): Serializable =
    deepCopy(value).asInstanceOf[Serializable]

  override def assemble(cached: Serializable, owner: Any): util.Set[AuthenticatorTransport] =
    deepCopy(cached.asInstanceOf[util.Set[AuthenticatorTransport]])
}
