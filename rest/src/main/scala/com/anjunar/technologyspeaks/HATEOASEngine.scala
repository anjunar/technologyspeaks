package com.anjunar.technologyspeaks

import com.anjunar.jaxrs.types.Table
import com.anjunar.technologyspeaks.document.Document
import com.anjunar.technologyspeaks.documents.DocumentsResource
import com.anjunar.technologyspeaks.documents.document.DocumentResource
import com.anjunar.technologyspeaks.security.{LoginFinishResource, LoginOptionsResource, RegisterFinishResource, RegisterOptionsResource}
import com.anjunar.vertx.fsm.{FSMBuilder, FSMEngine, StateDef}
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
class HATEOASEngine extends FSMEngine {

  val fsm = FSMBuilder()

  fsm.transition(
    StateDef(
      rel = "application",
      name = "Application",
      resource = classOf[ApplicationResource]
    ), application => {

      val loginOptions = fsm.transition(
        StateDef(
          rel = "login",
          name = "Login",
          resource = classOf[LoginOptionsResource]
        ), loginOptions => Seq(
          fsm.transition(
            StateDef(
              rel = "login",
              name = "Login",
              resource = classOf[LoginFinishResource]
            ), loginFinish => Seq(application)
          )
        ))

      val registerOptions = fsm.transition(
        StateDef(
          rel = "register",
          name = "Register",
          resource = classOf[RegisterOptionsResource]
        ), registerOptions => Seq(
          fsm.transition(
            StateDef(
              rel = "register",
              name = "Register",
              resource = classOf[RegisterFinishResource]
            ), registerFinish => Seq(loginOptions)
          )
        ))

      val documentSearch = fsm.transition(
        StateDef(
          rel = "documents",
          name = "Search",
          resource = classOf[DocumentsResource.Search]
        ), documentSearch => {
          val documentDelete = fsm.transition(
            StateDef(
              rel = "delete",
              name = "Delete",
              resource = classOf[DocumentResource.Delete]
            ), document => Seq(documentSearch))
          Seq(
            fsm.transition(
              StateDef(
                rel = "list",
                name = "Documents",
                resource = classOf[DocumentsResource.List]
              ), documentList => Seq(
                fsm.transition(
                  StateDef(
                    rel = "create",
                    name = "Create",
                    ref = classOf[Table[Document]],
                    resource = classOf[DocumentResource.Create]
                  ), documentCreate => Seq(
                    fsm.transition(
                      StateDef(
                        rel = "save",
                        name = "Save",
                        resource = classOf[DocumentResource.Save]
                      ), documentSave => Seq(documentSearch, documentDelete))
                  )),
                fsm.transition(
                  StateDef(
                    rel = "read",
                    name = "Read",
                    ref = classOf[Document],
                    resource = classOf[DocumentResource.Read]
                  ), documentRead => Seq(
                    fsm.transition(
                      StateDef(
                        rel = "update",
                        name = "Update",
                        resource = classOf[DocumentResource.Update]
                      ), documentUpdate => Seq(documentSearch, documentDelete))))
              )))
        })

      Seq(loginOptions, registerOptions, documentSearch)
    }
  )

}
