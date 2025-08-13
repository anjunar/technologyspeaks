package com.anjunar.jpa

import org.hibernate.boot.model.relational.SimpleAuxiliaryDatabaseObject
import org.hibernate.boot.registry.StandardServiceRegistryBuilder
import org.hibernate.boot.spi.BootstrapContext
import org.hibernate.boot.{Metadata, MetadataSources}
import org.hibernate.collection.spi.CollectionSemanticsResolver
import org.hibernate.engine.spi.SessionFactoryImplementor
import org.hibernate.integrator.spi.Integrator

import java.util

class PostgresIndexIntegrator extends Integrator {

  override def integrate(metadata: Metadata, bootstrapContext: BootstrapContext, sessionFactory: SessionFactoryImplementor): Unit = {

    val connection = sessionFactory
      .getJdbcServices
      .getBootstrapJdbcConnectionAccess
      .obtainConnection()

    val statement = connection.createStatement()
    statement.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm")
    statement.execute("CREATE EXTENSION IF NOT EXISTS vector")

    metadata.getEntityBindings.forEach(entity => {
      if (entity.getMappedClass != null) {
        val indices = entity.getMappedClass.getAnnotation(classOf[PostgresIndices])

        if (indices != null) {
          indices.value().foreach(index => {
            if (index != null) {
              var sql = s"CREATE INDEX ${index.name} ON ${entity.getTable.getName} USING ${index.using} ( ${index.columnList} )"
              if (index.where.nonEmpty) sql += " WHERE " + index.where

              val dialects = new util.HashSet[String]()
              dialects.add("com.anjunar.technologyspeaks.configuration.Postgres16Dialect")

              metadata.getDatabase.addAuxiliaryDatabaseObject(new SimpleAuxiliaryDatabaseObject(
                metadata.getDatabase.getDefaultNamespace,
                sql,
                null,
                dialects,
                false
              ))
            }
          })
        }
      }

    })


  }
}
