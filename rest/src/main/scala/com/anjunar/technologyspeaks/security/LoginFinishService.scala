package com.anjunar.technologyspeaks.security

import com.anjunar.vertx.fsm.services.JsonFSMService
import com.webauthn4j.credential.CredentialRecord
import com.webauthn4j.data.AuthenticationParameters
import com.webauthn4j.data.client.Origin
import com.webauthn4j.server.ServerProperty
import io.vertx.core.Future
import io.vertx.core.json.JsonObject
import io.vertx.ext.web.RoutingContext
import jakarta.enterprise.context.ApplicationScoped

import java.util.concurrent.CompletableFuture
import scala.jdk.CollectionConverters.*

import java.util

@ApplicationScoped
class LoginFinishService extends JsonFSMService[JsonObject] with WebAuthnService {

  override def run(ctx: RoutingContext, entity: JsonObject): Future[JsonObject] = {
    val body = Option(ctx.body().asJsonObject()).getOrElse(new JsonObject())
    val publicKeyCredential = body.getJsonObject("publicKeyCredential")
    val username = body.getString("username")
    val credentialId = publicKeyCredential.getString("id")
    if (credentialId == null || credentialId.isEmpty) {
      throw new IllegalArgumentException("Credential ID is missing in response")
    }

    Future.fromCompletionStage(webAuthnManager.parseAuthenticationResponseJSON(publicKeyCredential.encode())
      .thenCompose { authenticationData =>
        Option(credentialStore.get(username))
          .flatMap(_.asScala.find(_.asInstanceOf[CredentialRecordImpl].getCredentialId == credentialId))
          .map { credentialRecord =>
            Option(challengeStore.get(username)) match {
              case Some(challenge) =>
                val serverProperty = new ServerProperty(new Origin(ORIGIN), RP_ID, challenge)
                val authenticationParameters = new AuthenticationParameters(
                  serverProperty,
                  credentialRecord,
                  null,
                  false,
                  true
                )

                webAuthnManager.verify(authenticationData, authenticationParameters)
                  .thenApply { _ =>
                    updateCounter(username, credentialId, authenticationData.getAuthenticatorData.getSignCount)
                    new JsonObject().put("status", "success").put("credentialId", credentialId)
                  }
              case None =>
                CompletableFuture.failedFuture(new IllegalStateException("No challenge found for user"))
            }
          }
          .getOrElse(CompletableFuture.failedFuture(new IllegalStateException("No credential found for user")))
      })
  }

  private def updateCounter(username: String, credentialId: String, signCount: Long): Unit = {
    Option(credentialStore.get(username)) match {
      case Some(credentials) =>
        val updatedCredentials : util.List[CredentialRecord] = credentials.asScala.map {
          case record: CredentialRecordImpl if record.getCredentialId == credentialId =>
            record.setCounter(signCount)
            record
          case record => record
        }.asJava
        credentialStore.put(username, updatedCredentials)
      case None =>
    }
  }

}
