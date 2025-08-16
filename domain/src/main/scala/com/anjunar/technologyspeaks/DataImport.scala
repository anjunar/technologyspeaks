package com.anjunar.technologyspeaks

import com.anjunar.technologyspeaks.control.{Address, Credential, CredentialPassword, EMail, Role, User, UserInfo}
import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.event.Observes
import org.hibernate.reactive.stage.Stage
import org.jboss.weld.environment.se.events.ContainerInitialized

import java.time.LocalDate
import java.util.concurrent.CompletableFuture
import java.util.concurrent.CompletionStage

@ApplicationScoped
class DataImport {

  def init(@Observes event: ContainerInitialized, sessionFactory: Stage.SessionFactory): Unit = {
    sessionFactory.withTransaction((session, tx) =>
      ensureRole(session, "Administrator", "Administrator")
        .thenCompose(_ => ensureRole(session, "User", "User"))
        .thenCompose(_ => ensureRole(session, "Guest", "Guest"))
        .thenCompose(_ => ensureRole(session, "Confirmed", "Confirmed"))
        .thenCompose(_ => ensureUser(session))
    ).whenComplete((_, err) =>
      if (err != null) err.printStackTrace()
      else println("Startup initialization done")
    )
  }

  private def ensureRole(session: Stage.Session, name: String, description: String): CompletionStage[Role] = {
    session.createQuery("from Role where name = :name", classOf[Role])
      .setParameter("name", name)
      .getSingleResultOrNull
      .thenCompose(role => {
        if (role != null) CompletableFuture.completedFuture(role)
        else {
          val newRole = new Role
          newRole.name = name
          newRole.description = description
          session.persist(newRole).thenApply(_ => newRole)
        }
      })
  }

  private def ensureUser(session: Stage.Session): CompletionStage[User] = {
    session.createQuery(
        "from User u join fetch u.emails e where e.value = :email",
        classOf[User]
      ).setParameter("email", "anjunar@gmx.de")
      .getSingleResultOrNull
      .thenCompose(existing => {
        if (existing != null) CompletableFuture.completedFuture(existing)
        else {
          val info = new UserInfo
          info.firstName = "Patrick"
          info.lastName = "Bittner"
          info.birthDate = LocalDate.of(1980, 4, 1)

          val address = new Address
          address.street = "Beim alten Schützenhof"
          address.number = "28"
          address.zipCode = "22083"
          address.country = "Deutschland"

          // Administrator Role laden
          session.createQuery("from Role where name = :name", classOf[Role])
            .setParameter("name", "Administrator")
            .getSingleResult
            .thenCompose(adminRole => {
              val token = new Credential
              token.roles.add(adminRole)

              val email = new EMail
              token.email = email
              email.value = "anjunar@gmx.de"
              email.credentials.add(token)

              val patrick = new User
              email.user = patrick
              patrick.nickName = "Anjunar"
              patrick.enabled = true
              patrick.deleted = false
              patrick.info = info
              patrick.address = address
              patrick.emails.add(email)

              val passwordCredential = new CredentialPassword
              passwordCredential.password = "patrick"
              passwordCredential.roles.add(adminRole)
              email.credentials.add(passwordCredential)

              session.persist(patrick).thenApply(_ => patrick)
            })
        }
      })
  }
}
