package com.anjunar.technologyspeaks

import com.anjunar.jaxrs.types.Table
import com.anjunar.technologyspeaks.document.{Document, DocumentSearch}
import com.anjunar.vertx.fsm.services.TableFSMService
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.hibernate.reactive.mutiny.Mutiny
import org.hibernate.reactive.stage.Stage

import scala.compiletime.uninitialized

@ApplicationScoped
class DocumentsService extends TableFSMService[DocumentSearch, Table[Document]] {

  @Inject
  var sessionFactory: Stage.SessionFactory = uninitialized

  override def search(callback: DocumentSearch => Unit): Unit = callback(new DocumentSearch)

  override def list(callback: Table[Document] => Unit): Unit = {
    sessionFactory
      .withTransaction((session, tx) => {
        session
          .createQuery("from Document", classOf[Document])
          .getResultList
          .thenApply(documents => new Table[Document](documents, documents.size()))
      })
      .thenApply(entity => callback(entity))
  }
  
}
