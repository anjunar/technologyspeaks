package com.anjunar.technologyspeaks

import com.anjunar.jaxrs.types.Table
import com.anjunar.technologyspeaks.document.{Document, DocumentSearch}
import com.anjunar.technologyspeaks.documents.{DocumentsResource, DocumentsSearchResource}
import com.anjunar.technologyspeaks.documents.document.{DocumentCreateResource, DocumentReadResource}
import com.anjunar.technologyspeaks.security.{LoginFinishResource, LoginOptionsResource, RegisterFinishResource, RegisterOptionsResource}
import com.anjunar.vertx.fsm.{FSMBuilder, FSMEngine, StateDef}
import io.vertx.core.json.JsonObject
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
          resource = classOf[DocumentsSearchResource]
        ), documentSearch => Seq(
          fsm.transition(
            StateDef(
              rel = "list",
              name = "Documents",
              resource = classOf[DocumentsResource]
            ), documents => Seq(
              fsm.transition(
                StateDef(
                  rel = "create",
                  name = "Create",
                  ref = classOf[Table[Document]],
                  resource = classOf[DocumentCreateResource]
                ), document => Seq()),
              fsm.transition(
                StateDef(
                  rel = "read",
                  name = "Read",
                  ref = classOf[Document],
                  resource = classOf[DocumentReadResource]
                ), document => Seq())
            ))))

      Seq(loginOptions, registerOptions, documentSearch)
    }
  )

}
