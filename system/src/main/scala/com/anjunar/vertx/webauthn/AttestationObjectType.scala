package com.anjunar.vertx.webauthn

import com.anjunar.configuration.ObjectMapperContextResolver
import com.webauthn4j.converter.AuthenticatorDataConverter
import com.webauthn4j.converter.util.ObjectConverter
import com.webauthn4j.data.attestation.AttestationObject
import com.webauthn4j.data.attestation.authenticator.AuthenticatorData
import org.hibernate.`type`.descriptor.WrapperOptions
import org.hibernate.usertype.UserType
import org.postgresql.util.PGobject

import com.webauthn4j.converter.AttestationObjectConverter
import java.sql.{PreparedStatement, ResultSet, Types}
import java.util.Objects

class AttestationObjectType extends UserType[AttestationObject] {

  private val objectMapper = new ObjectConverter()
  private val authenticatorObjectConverter = new AttestationObjectConverter(objectMapper)

  override def getSqlType: Int = Types.OTHER

  override def returnedClass(): Class[AttestationObject] = classOf[AttestationObject]

  override def equals(x: AttestationObject, y: AttestationObject): Boolean = Objects.equals(x, y)

  override def hashCode(x: AttestationObject): Int = Objects.hashCode(x)

  override def nullSafeGet(rs: ResultSet, position: Int, options: WrapperOptions): AttestationObject = {
    val json = rs.getString(position)
    if (json == null) null
    else authenticatorObjectConverter.convert(json)
  }

  override def nullSafeSet(st: PreparedStatement, value: AttestationObject, position: Int, options: WrapperOptions): Unit = {
    if (value == null) st.setNull(position, Types.OTHER)
    else {
      val pgObject = new PGobject()
      pgObject.setType("text")
      pgObject.setValue(authenticatorObjectConverter.convertToBase64urlString(value))
      st.setObject(position, pgObject)
    }
  }

  override def deepCopy(value: AttestationObject): AttestationObject = {
    if (value == null) null
    else authenticatorObjectConverter.convert(authenticatorObjectConverter.convertToBase64urlString(value))
  }

  override def isMutable: Boolean = true

  override def disassemble(value: AttestationObject): Serializable =
    deepCopy(value).asInstanceOf[Serializable]

  override def assemble(cached: Serializable, owner: Any): AttestationObject =
    deepCopy(cached.asInstanceOf[AttestationObject])
}
