package com.anjunar.hibernate.reactive

import jakarta.persistence.{AttributeConverter, Converter}

import java.util.UUID

@Converter(autoApply = true)
class UUIDConverter extends AttributeConverter[UUID, String] {
  override def convertToDatabaseColumn(uuid: UUID): String =
    if (uuid == null) null else uuid.toString

  override def convertToEntityAttribute(dbData: String): UUID =
    if (dbData == null) null else UUID.fromString(dbData)
}