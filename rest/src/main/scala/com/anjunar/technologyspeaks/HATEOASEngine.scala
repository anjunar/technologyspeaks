package com.anjunar.technologyspeaks

import com.anjunar.vertx.fsm.*
import com.anjunar.technologyspeaks.document.{Document, DocumentSearch}
import com.anjunar.technologyspeaks.security.{LoginFinishService, LoginOptionsService, RegisterFinishService, RegisterOptionsService}
import com.anjunar.vertx.fsm.{FSMBuilder, FSMEngine}
import com.anjunar.vertx.fsm.states.{DefaultStateDef, JsonStateDef, TableListStateDef, TableSearchStateDef}
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
          name = "Login",
          url = "/webAuthn/login/options",
          entity = classOf[JsonObject],
          service = classOf[LoginOptionsService]
        ), loginOptions => Seq(
          fsm.transition(
            JsonStateDef(
              name = "Login",
              url = "/webAuthn/login/finish",
              entity = classOf[JsonObject],
              service = classOf[LoginFinishService]
            ), loginFinish => Seq(application)
          )
        ))

      val registerOptions = fsm.transition(
        JsonStateDef(
          name = "Register",
          url = "/webAuthn/register/options",
          entity = classOf[JsonObject],
          service = classOf[RegisterOptionsService]
        ), registerOptions => Seq(
          fsm.transition(
            JsonStateDef(
              name = "Register",
              url = "/webAuthn/register/finish",
              entity = classOf[JsonObject],
              service = classOf[RegisterFinishService]
            ), registerFinish => Seq(loginOptions)
          )
        ))

      val documentSearch = fsm.transition(
        TableSearchStateDef(
          name = "DocumentSearch",
          url = "/documents/search",
          entity = classOf[DocumentSearch],
          service = classOf[DocumentsService]
        ), documentSearch => Seq(
          fsm.transition(
            TableListStateDef(
              name = "Documents",
              url = "/documents",
              entity = classOf[Document],
              service = classOf[DocumentsService]
            ), documents => Seq())))

      Seq(loginOptions, registerOptions, documentSearch)
    }
  )

}
