package com.anjunar.technologyspeaks

import com.anjunar.jaxrs.types.Table
import com.anjunar.scala.schema.model.Link
import com.anjunar.technologyspeaks.control.{User, UserResource, UsersResource}
import com.anjunar.technologyspeaks.document.Document
import com.anjunar.technologyspeaks.documents.{DocumentResource, DocumentsResource}
import com.anjunar.technologyspeaks.security.*
import com.anjunar.technologyspeaks.shared.property.ManagedProperty
import com.anjunar.vertx.fsm.{FSMBuilder, FSMEngine, StateDef}
import io.vertx.core.json.JsonObject
import jakarta.enterprise.context.ApplicationScoped
import jakarta.ws.rs.core.Response

@ApplicationScoped
class HATEOASEngine extends FSMEngine {

  val fsm = FSMBuilder()

  fsm.transition(
    StateDef[Application](
      rel = "application",
      name = "Application",
      view = "application",
      resource = classOf[ApplicationResource]
    ), application => {

      val logout = fsm.transition(StateDef[Response](
        rel = "logout",
        name = "Logout",
        resource = classOf[LogoutResource]
      ), logout => Seq())

      val loginOptions = loginFlow(application)

      val registerOptions = registerFlow(loginOptions)

      val userSearch = usersFlow

      val documentSearch = documentFlow

      Seq(logout, loginOptions, registerOptions, userSearch, documentSearch)
    }
  )

  private def registerFlow(loginOptions: StateDef[JsonObject]) = {
    fsm.transition(
      StateDef[JsonObject](
        rel = "register",
        name = "Register",
        resource = classOf[RegisterOptionsResource]
      ), registerOptions => Seq(
        fsm.transition(
          StateDef[JsonObject](
            rel = "register",
            name = "Register",
            resource = classOf[RegisterFinishResource]
          ), registerFinish => Seq(loginOptions)
        )
      ))
  }

  private def loginFlow(application: StateDef[Application]) = {
    fsm.transition(
      StateDef[JsonObject](
        rel = "login",
        name = "Login",
        resource = classOf[LoginOptionsResource]
      ), loginOptions => Seq(
        fsm.transition(
          StateDef[JsonObject](
            rel = "login",
            name = "Login",
            resource = classOf[LoginFinishResource]
          ), loginFinish => Seq(application)
        )
      ))
  }


  private def usersFlow = {
    fsm.transition(
      StateDef[User](
        rel = "users",
        name = "Users",
        view = "table",
        resource = classOf[UsersResource.Search]
      ), search => {
        val documentDelete = fsm.transition(
          StateDef[User](
            rel = "delete",
            name = "Delete",
            view = "form",
            resource = classOf[UserResource.Delete]
          ), delete => Seq(search))
        Seq(
          fsm.transition(
            StateDef[User](
              rel = "list",
              name = "Users",
              view = "table",
              resource = classOf[UsersResource.List]
            ), list => Seq(
              fsm.transition(
                StateDef[User](
                  rel = "create",
                  name = "Create",
                  ref = classOf[Table[User]],
                  resource = classOf[UserResource.Create]
                ), create => Seq(
                  fsm.transition(
                    StateDef[User](
                      rel = "save",
                      name = "Save",
                      resource = classOf[UserResource.Save]
                    ), save => Seq(search, documentDelete))
                )),
              fsm.transition(
                StateDef[User](
                  rel = "read",
                  name = "Read",
                  ref = classOf[User],
                  resource = classOf[UserResource.Read],
                  generatePath = (path, entity) => path.replace(":id", entity.id.toString)
                ), read => Seq(
                  fsm.transition(
                    StateDef[ManagedProperty](
                      rel = "security",
                      name = "Secured Property",
                      withLinks = false,
                      resource = classOf[ManagedPropertyResource]
                    ), update => Seq()),
                  fsm.transition(
                    StateDef[User](
                      rel = "update",
                      name = "Update",
                      resource = classOf[UserResource.Update]
                    ), update => Seq(search, documentDelete))))
            )))
      })
  }

  private def documentFlow = {
    fsm.transition(
      StateDef[Document](
        rel = "documents",
        name = "Documents",
        resource = classOf[DocumentsResource.Search]
      ), documentSearch => {
        val documentDelete = fsm.transition(
          StateDef[Document](
            rel = "delete",
            name = "Delete",
            resource = classOf[DocumentResource.Delete]
          ), document => Seq(documentSearch))
        Seq(
          fsm.transition(
            StateDef[Document](
              rel = "list",
              name = "Documents",
              resource = classOf[DocumentsResource.List]
            ), documentList => Seq(
              fsm.transition(
                StateDef[Document](
                  rel = "create",
                  name = "Create",
                  ref = classOf[Table[Document]],
                  resource = classOf[DocumentResource.Create]
                ), documentCreate => Seq(
                  fsm.transition(
                    StateDef[Document](
                      rel = "save",
                      name = "Save",
                      resource = classOf[DocumentResource.Save]
                    ), documentSave => Seq(documentSearch, documentDelete))
                )),
              fsm.transition(
                StateDef[Document](
                  rel = "read",
                  name = "Read",
                  ref = classOf[Document],
                  resource = classOf[DocumentResource.Read],
                  generatePath = (path, entity) => path.replace(":id", entity.id.toString)
                ), documentRead => Seq(
                  fsm.transition(
                    StateDef[Document](
                      rel = "update",
                      name = "Update",
                      resource = classOf[DocumentResource.Update]
                    ), documentUpdate => Seq(documentSearch, documentDelete))))
            )))
      })
  }
}
