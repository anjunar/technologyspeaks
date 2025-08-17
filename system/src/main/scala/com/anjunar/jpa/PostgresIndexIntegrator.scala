package com.anjunar.jpa

import com.typesafe.scalalogging.Logger
import jakarta.persistence.Table
import org.hibernate.boot.Metadata
import org.hibernate.boot.model.relational.SimpleAuxiliaryDatabaseObject
import org.hibernate.boot.spi.BootstrapContext
import org.hibernate.engine.spi.SessionFactoryImplementor
import org.hibernate.integrator.spi.Integrator
import org.hibernate.reactive.pool.{ReactiveConnection, ReactiveConnectionPool}

import java.util
import java.util.concurrent.{CompletableFuture, CompletionStage}
import scala.jdk.CollectionConverters.*

class PostgresIndexIntegrator extends Integrator {

  val log = Logger[PostgresIndexIntegrator]

  override def integrate(metadata: Metadata, bootstrapContext : BootstrapContext, sessionFactory: SessionFactoryImplementor): Unit = {
    val connectionPool = sessionFactory.getServiceRegistry
      .getService(classOf[ReactiveConnectionPool])

    connectionPool.getConnection().thenCompose { connection =>
      executeExtensionCreation(connection)
        .thenCompose(_ => executeIndexCreation(metadata, connection))
        .whenComplete { (_, throwable) =>
          if (throwable != null) {
            log.error(throwable.getMessage, throwable)
          } else {
            log.info("Indexes successfully created")
          }
          connection.close()
        }
    }
  }

  private def executeExtensionCreation(connection: ReactiveConnection): CompletionStage[Void] = {
    val extensionScripts = Seq(
      "CREATE EXTENSION IF NOT EXISTS pg_trgm",
      "CREATE EXTENSION IF NOT EXISTS vector"
    )

    extensionScripts.foldLeft(
      CompletableFuture.completedFuture(null.asInstanceOf[Void]): CompletionStage[Void]
    ) { (future, script) =>
      future.thenCompose(_ =>
        connection.execute(script)
          .thenAccept(_ => log.info(s"Extension created: $script"))
          .exceptionally { t =>
            log.error(t.getMessage, t)
            null
          }
          .toCompletableFuture
      )
    }
  }

  private def executeIndexCreation(metadata: Metadata, connection: ReactiveConnection): CompletionStage[Void] = {
    val futures: Seq[CompletableFuture[Void]] = metadata.getEntityBindings.asScala.flatMap { entity =>
      Option(entity.getMappedClass).toSeq.flatMap { clazz =>
        Option(clazz.getAnnotation(classOf[PostgresIndices])).toSeq.flatMap { indices =>
          val tableName = Option(clazz.getAnnotation(classOf[Table]))
            .map(_.name)
            .filter(_.nonEmpty)
            .getOrElse(entity.getTable.getName)

          indices.value().toSeq.map { index =>

            val column = index.using() match {
              case "GIN" => "gin_trgm_ops"
              case "hnsw" => "vector_l2_ops"
            }

            val sql = if (index.where().isEmpty) {
              s"CREATE INDEX ${index.name} ON $tableName USING ${index.using} (${index.columnList} $column)"
            } else {
              s"CREATE INDEX ${index.name} ON $tableName USING ${index.using} (${index.columnList} $column) WHERE ${index.where}"
            }

            val future: CompletableFuture[Void] =
              connection.execute(sql)
                .thenAccept(_ => log.info(s"Index created: $sql"))
                .exceptionally { t =>
                  log.error(t.getMessage, t)
                  null
                }
                .toCompletableFuture

            val dialects = new util.HashSet[String]()
            dialects.add("org.hibernate.dialect.PostgreSQLDialect")
            metadata.getDatabase.addAuxiliaryDatabaseObject(
              new SimpleAuxiliaryDatabaseObject(
                metadata.getDatabase.getDefaultNamespace,
                sql,
                null,
                dialects,
                false
              )
            )

            future
          }
        }
      }
    }.toSeq

    val futureArray: Array[CompletableFuture[Void]] = futures.toArray

    java.util.concurrent.CompletableFuture
      .allOf(futureArray*)
      .thenApply(_ => null.asInstanceOf[Void])
  }

}
