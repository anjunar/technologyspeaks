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
import io.vertx.core.{CompositeFuture, Future}

import java.util
import java.util.concurrent.CompletionStage

@ApplicationScoped
class HibernateCredentialStore extends CredentialStore {

  override def credentialId(record: CredentialRecord): String = record.asInstanceOf[WebAuthnCredentialRecord].getCredentialID

  override def loadUser(credentialId: String): CompletionStage[User] = {
    CredentialWebAuthn.loadByCredentialId(credentialId)
      .thenApply(entity => {
        User.create(JsonObject.of(
          "id", entity.email.user.id,
          "email", entity.email.value,
          "credentialId", entity.credentialId,
          "roles", JsonArray.of(entity.roles.stream().map(role => role.name).toArray*)
        ))
      })
  }

  override def saveRecord(email: String, record: WebAuthnCredentialRecord): CompletionStage[Void] = {

    val roleFuture = Future.fromCompletionStage(Role.query("name" -> "Guest"))
    val emailFuture = Future.fromCompletionStage(EMail.query("value" -> email))

    Future.all(roleFuture, emailFuture).compose(_ => {
      val role = roleFuture.result()
      val eMail = emailFuture.result()

      val targetEmailFuture: Future[EMail] =
        if eMail == null then
          val mail = new EMail
          mail.value = email
          val user = new control.User
          user.emails.add(mail)
          mail.user = user
          Future.fromCompletionStage(user.persist().thenApply(_ => mail))
        else
          Future.succeededFuture(eMail)

      targetEmailFuture.compose(mail => {
        val requiredPersistedData = record.getRequiredPersistedData
        val credential = new CredentialWebAuthn()
        credential.credentialId = requiredPersistedData.credentialId()
        credential.publicKey = requiredPersistedData.publicKey()
        credential.publicKeyAlgorithm = requiredPersistedData.publicKeyAlgorithm()
        credential.counter = requiredPersistedData.counter()
        credential.aaguid = requiredPersistedData.aaguid()
        credential.roles.add(role)
        credential.email = mail

        Future.fromCompletionStage(credential.persist()) 
      })
    }).toCompletionStage
  }

  override def loadByUsername(username: String): CompletionStage[util.List[? <: CredentialRecord]] = {
    CredentialWebAuthn.findByEmail(username)
      .thenApply(entities => entities.stream().map(entity => {
        WebAuthnCredentialRecord.fromRequiredPersistedData(
          new RequiredPersistedData(username, entity.credentialId, entity.aaguid, entity.publicKey, entity.publicKeyAlgorithm, entity.counter)
        )
      }).toList)
  }

  override def loadByCredentialId(credentialId: String): CompletionStage[? <: CredentialRecord] = {
    CredentialWebAuthn.loadByCredentialId(credentialId)
      .thenApply(entity => {
        WebAuthnCredentialRecord.fromRequiredPersistedData(
          new RequiredPersistedData(entity.email.value, entity.credentialId, entity.aaguid, entity.publicKey, entity.publicKeyAlgorithm, entity.counter)
        )
      })
  }
}
