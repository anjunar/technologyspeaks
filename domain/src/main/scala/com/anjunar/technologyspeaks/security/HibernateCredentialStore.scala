package com.anjunar.technologyspeaks.security

import com.anjunar.technologyspeaks.control.{CredentialWebAuthn, EMail, Role}
import com.anjunar.vertx.webauthn.{CredentialStore, WebAuthnCredentialRecord}
import com.webauthn4j.credential.CredentialRecord
import com.webauthn4j.data.RegistrationData
import io.vertx.core.json.{JsonArray, JsonObject}
import io.vertx.ext.auth.User
import jakarta.enterprise.context.ApplicationScoped
import com.anjunar.technologyspeaks.control
import com.anjunar.vertx.webauthn.WebAuthnCredentialRecord.RequiredPersistedData
import com.typesafe.scalalogging.Logger
import io.vertx.core.{CompositeFuture, Future}
import jakarta.inject.Inject
import jakarta.persistence.NoResultException
import org.hibernate.reactive.stage.Stage

import java.util
import java.util.concurrent.{CompletableFuture, CompletionStage}
import scala.compiletime.uninitialized

@ApplicationScoped
class HibernateCredentialStore extends CredentialStore {

  val log = Logger[HibernateCredentialStore]

  @Inject
  var sessionFactory : Stage.SessionFactory = uninitialized

  override def credentialId(record: CredentialRecord): String = record.asInstanceOf[WebAuthnCredentialRecord].getCredentialID

  override def loadUser(credentialId: String): CompletionStage[User] = {
    sessionFactory.withTransaction(implicit session => {
      CredentialWebAuthn.loadByCredentialId(credentialId)
        .thenApply(entity => {
          User.create(JsonObject.of(
            "id", entity.email.user.id,
            "email", entity.email.value,
            "credentialId", entity.credentialId,
            "roles", JsonArray.of(entity.roles.stream().map(role => role.name).toArray *)
          ))
        })
    })
  }

  override def saveRecord(email: String, record: WebAuthnCredentialRecord): CompletionStage[Void] = {
    sessionFactory.withTransaction(implicit session => {
      Role.query("name" -> "Guest").toCompletableFuture
        .thenCompose(role => {
          EMail.query("value" -> email).toCompletableFuture
            .thenCompose(eMail => {
              val targetEmailFuture =
                if (eMail == null) {
                  val mail = new EMail
                  mail.value = email
                  val user = new control.User
                  user.emails.add(mail)
                  mail.user = user
                  user.persist().thenApply(_ => mail)
                } else {
                  CompletableFuture.completedFuture(eMail)
                }

              targetEmailFuture.thenCompose(mail => {
                val requiredPersistedData = record.getRequiredPersistedData
                val credential = new CredentialWebAuthn()
                credential.credentialId = requiredPersistedData.credentialId()
                credential.publicKey = requiredPersistedData.publicKey()
                credential.publicKeyAlgorithm = requiredPersistedData.publicKeyAlgorithm()
                credential.counter = requiredPersistedData.counter()
                credential.aaguid = requiredPersistedData.aaguid()
                credential.roles.add(role)
                credential.email = mail

                credential.persist()
              })
            })
        })
    })
  }
  
  override def loadByUsername(username: String): CompletionStage[util.List[? <: CredentialRecord]] = {
    sessionFactory.withTransaction(implicit session => {
      CredentialWebAuthn.findByEmail(username)
        .thenApply(entities => entities.stream().map(entity => {
          WebAuthnCredentialRecord.fromRequiredPersistedData(
            new RequiredPersistedData(username, entity.credentialId, entity.aaguid, entity.publicKey, entity.publicKeyAlgorithm, entity.counter)
          )
        }).toList)
    })
  }

  override def loadByCredentialId(credentialId: String): CompletionStage[? <: CredentialRecord] = {
    sessionFactory.withTransaction(implicit session => {
      CredentialWebAuthn.loadByCredentialId(credentialId)
        .thenApply(entity => {
          WebAuthnCredentialRecord.fromRequiredPersistedData(
            new RequiredPersistedData(entity.email.value, entity.credentialId, entity.aaguid, entity.publicKey, entity.publicKeyAlgorithm, entity.counter)
          )
        })
    })
  }
}
