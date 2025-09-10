package com.anjunar.jaxrs.search.jpa

import com.anjunar.jaxrs.search.jpa.{JPASearchContext, JPASearchContextResult}
import com.anjunar.jaxrs.search.{Context, PredicateProvider, SearchBeanReader}
import com.anjunar.jaxrs.types.{AbstractSearch, Table}
import com.anjunar.scala.introspector.DescriptionIntrospector
import com.anjunar.scala.universe.TypeResolver
import com.anjunar.vertx.engine.SchemaProvider
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.persistence.Tuple
import jakarta.persistence.criteria.*
import org.hibernate.reactive.stage.Stage

import java.util
import java.util.concurrent.{CompletableFuture, CompletionStage}
import scala.collection.mutable
import scala.compiletime.uninitialized
import scala.jdk.CollectionConverters.*

object JPAUtil {

  def fetchEntitiesRecursively(entities: util.List[Tuple], entityClass: Class[?], session: Stage.Session, depth: Int = 0, maxDepth: Int = 5): CompletableFuture[util.List[Tuple]] = {
    val fetchFutures = entities.asScala.toList.foldLeft(CompletableFuture.completedFuture(null): CompletableFuture[Void]) { (future, entity) =>
      future.thenCompose { _ =>
        fetchEntityRecursively(entity.get(0, entityClass), entityClass, session)
      }
    }
    fetchFutures.thenApply(_ => entities)
  }

  def fetchEntityRecursively(entity: AnyRef, entityClass: Class[?], session: Stage.Session, depth: Int = 0, maxDepth: Int = 5): CompletableFuture[Void] = {
    if (entity == null || depth >= maxDepth) {
      return CompletableFuture.completedFuture(null)
    }

    val model = DescriptionIntrospector.createWithType(entityClass)
    val schemaProvider = TypeResolver.companionInstance(entityClass).asInstanceOf[SchemaProvider[AnyRef]]

    schemaProvider.schema.props
      .filter(_.instanceHandler.isDefined)
      .foldLeft(CompletableFuture.completedFuture(null): CompletableFuture[Void]) { (future, property) =>
        future.thenCompose { _ =>
          val descriptorProperty = model.findProperty(property.name)
          val value = descriptorProperty.get(entity)

          value match {
            case collection: java.util.Collection[?] =>
              session.fetch(collection)
                .thenCompose { _ =>
                  collection.asScala
                    .filter(_ != null)
                    .foldLeft(CompletableFuture.completedFuture(null): CompletableFuture[Void]) { (collFuture, item) =>
                      collFuture.thenCompose { _ =>
                        fetchEntityRecursively(item.asInstanceOf[AnyRef], item.getClass, session, depth + 1, maxDepth)
                      }
                    }
                }
            case singleEntity: AnyRef =>
              session.fetch(singleEntity)
                .thenCompose { _ =>
                  fetchEntityRecursively(singleEntity, singleEntity.getClass, session, depth + 1, maxDepth)
                }
            case _ =>
              CompletableFuture.completedFuture(null)
          }
        }
      }
  }
  
}
