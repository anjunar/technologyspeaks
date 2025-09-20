package com.anjunar.technologyspeaks

import com.anjunar.jaxrs.types.Table
import com.anjunar.technologyspeaks.control.{User, UserResource, UsersResource}
import com.anjunar.technologyspeaks.document.Document
import com.anjunar.technologyspeaks.documents.{DocumentResource, DocumentsResource}
import com.anjunar.technologyspeaks.security.{LoginFinishResource, LoginOptionsResource, RegisterFinishResource, RegisterOptionsResource}
import com.anjunar.vertx.fsm.{FSMBuilder, FSMEngine, StateDef}
import jakarta.enterprise.context.ApplicationScoped
import org.hibernate.boot.model.process.internal.UserTypeResolution

@ApplicationScoped
class HATEOASEngine extends FSMEngine {

  val fsm = FSMBuilder()

  fsm.transition(
    StateDef(
      rel = "application",
      name = "Application",
      view = "application",
      resource = classOf[ApplicationResource]
    ), application => {

      val loginOptions = loginFlow(application)

      val registerOptions = registerFlow(loginOptions)

      val userSearch = usersFlow

      val documentSearch = documentFlow

      Seq(loginOptions, registerOptions, userSearch, documentSearch)
    }
  )

  private def registerFlow(loginOptions: StateDef) = {
    fsm.transition(
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
  }

  private def loginFlow(application: StateDef) = {
    fsm.transition(
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
  }


  private def usersFlow = {
    fsm.transition(
      StateDef(
        rel = "users",
        name = "Users",
        view = "table",
        resource = classOf[UsersResource.Search]
      ), search => {
        val documentDelete = fsm.transition(
          StateDef(
            rel = "delete",
            name = "Delete",
            view = "form",
            resource = classOf[UserResource.Delete]
          ), delete => Seq(search))
        Seq(
          fsm.transition(
            StateDef(
              rel = "list",
              name = "Users",
              view = "table",
              resource = classOf[UsersResource.List]
            ), list => Seq(
              fsm.transition(
                StateDef(
                  rel = "create",
                  name = "Create",
                  ref = classOf[Table[User]],
                  resource = classOf[UserResource.Create]
                ), create => Seq(
                  fsm.transition(
                    StateDef(
                      rel = "save",
                      name = "Save",
                      resource = classOf[UserResource.Save]
                    ), save => Seq(search, documentDelete))
                )),
              fsm.transition(
                StateDef(
                  rel = "read",
                  name = "Read",
                  ref = classOf[User],
                  resource = classOf[UserResource.Read]
                ), read => Seq(
                  fsm.transition(
                    StateDef(
                      rel = "update",
                      name = "Update",
                      resource = classOf[UserResource.Update]
                    ), update => Seq(search, documentDelete))))
            )))
      })
  }

  private def documentFlow = {
    fsm.transition(
      StateDef(
        rel = "documents",
        name = "Documents",
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
  }
}
