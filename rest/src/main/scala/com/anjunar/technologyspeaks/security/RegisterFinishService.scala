package com.anjunar.technologyspeaks.security

import com.anjunar.vertx.fsm.services.JsonFSMService
import com.anjunar.vertx.webauthn.{CredentialStore, WebAuthnCredentialRecord}
import com.typesafe.scalalogging.Logger
import com.webauthn4j.data.attestation.statement.COSEAlgorithmIdentifier
import com.webauthn4j.data.{PublicKeyCredentialParameters, PublicKeyCredentialType, RegistrationParameters}
import com.webauthn4j.data.client.Origin
import com.webauthn4j.server.ServerProperty
import io.vertx.core.{Future, Promise}
import io.vertx.core.json.JsonObject
import io.vertx.ext.web.RoutingContext
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

import java.util
import java.util.Base64
import java.util.concurrent.CompletableFuture
import scala.jdk.CollectionConverters.*
import scala.compiletime.uninitialized

@ApplicationScoped
class RegisterFinishService extends JsonFSMService[JsonObject] with WebAuthnService {

  val log = Logger[RegisterFinishService]
  
  @Inject
  var store: CredentialStore = uninitialized

  override def run(ctx : RoutingContext, entity: JsonObject): Future[JsonObject] = {
    val body = Option(ctx.body().asJsonObject()).getOrElse(new JsonObject())
    val publicKeyCredential = body.getJsonObject("publicKeyCredential")
    val credentialId = publicKeyCredential.getString("id")
    val username = body.getString("username")

    Future.fromCompletionStage(webAuthnManager.parseRegistrationResponseJSON(publicKeyCredential.encode())
      .thenCompose { registrationData =>
        Option(challengeStore.get(username)) match {
          case Some(challenge) =>
            val serverProperty = new ServerProperty(new Origin(ORIGIN), RP_ID, challenge)
            val pubKeyCredParams = util.Arrays.asList(
              new PublicKeyCredentialParameters(PublicKeyCredentialType.PUBLIC_KEY, COSEAlgorithmIdentifier.ES256),
              new PublicKeyCredentialParameters(PublicKeyCredentialType.PUBLIC_KEY, COSEAlgorithmIdentifier.RS256)
            )
            val registrationParameters = new RegistrationParameters(
              serverProperty,
              pubKeyCredParams,
              false,
              true
            )

            webAuthnManager.verify(registrationData, registrationParameters)
              .thenCompose { _ =>
                val webAuthnCredentialRecord = new WebAuthnCredentialRecord(
                  username, 
                  registrationData.getAttestationObject,
                  registrationData.getCollectedClientData,
                  registrationData.getClientExtensions,
                  registrationData.getTransports
                )
                
                store.saveRecord(username, webAuthnCredentialRecord)
                  .handle((credentials, failure) => {
                    if (failure != null) {
                      
                      log.error(failure.getMessage, failure.getCause)
                      
                      new JsonObject()
                        .put("status", "error")
                        .put("message", failure.getMessage);
                    } else {
                      new JsonObject()
                        .put("status", "success")
                        .put("credentialId", credentialId);
                    }
                  })            
              }
          case None =>
            CompletableFuture.failedFuture(new IllegalStateException("No challenge found for user"))
        }
      })
  }

}
