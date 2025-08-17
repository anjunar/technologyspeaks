package com.anjunar.technologyspeaks

import com.anjunar.technologyspeaks.document.{Document, DocumentSearch}
import com.anjunar.technologyspeaks.security.{LoginFinishService, LoginOptionsService, RegisterFinishService, RegisterOptionsService}
import com.anjunar.vertx.fsm.states.*
import com.anjunar.vertx.fsm.{FSMBuilder, FSMEngine}
import io.vertx.core.json.JsonObject
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
class HATEOASEngine extends FSMEngine {

  val fsm = FSMBuilder()

  fsm.transition(
    DefaultStateDef(
      name = "Application",
      url = "",
      entity = classOf[Application],
      service = classOf[ApplicationService]
    ), application => {

      val loginOptions = fsm.transition(
        JsonStateDef(
          name = "login",
          url = "/security/login",
          entity = classOf[JsonObject],
          service = classOf[LoginOptionsService]
        ), loginOptions => Seq(
          fsm.transition(
            JsonStateDef(
              name = "login",
              url = "/security/login/finish",
              entity = classOf[JsonObject],
              service = classOf[LoginFinishService]
            ), loginFinish => Seq(application)
          )
        ))

      val registerOptions = fsm.transition(
        JsonStateDef(
          name = "register",
          url = "/security/register",
          entity = classOf[JsonObject],
          service = classOf[RegisterOptionsService]
        ), registerOptions => Seq(
          fsm.transition(
            JsonStateDef(
              name = "register",
              url = "/security/register/finish",
              entity = classOf[JsonObject],
              service = classOf[RegisterFinishService]
            ), registerFinish => Seq(loginOptions)
          )
        ))

      val documentSearch = fsm.transition(
        TableSearchStateDef(
          name = "documents",
          url = "/documents/search",
          entity = classOf[DocumentSearch],
          service = classOf[DocumentsService]
        ), documentSearch => Seq(
          fsm.transition(
            TableListStateDef(
              name = "documents",
              url = "/documents",
              entity = classOf[Document],
              service = classOf[DocumentsService]
            ), documents => Seq(
              fsm.transition(
                FormStateDef(
                  name = "document",
                  url = "/documents/document/:id",
                  entity = classOf[Document]
                ), document => Seq())
            ))))

      Seq(loginOptions, registerOptions, documentSearch)
    }
  )

}
