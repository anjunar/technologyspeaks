package com.anjunar.technologyspeaks.security

import com.anjunar.technologyspeaks.control.Role
import com.anjunar.vertx.webauthn.{CredentialStore, WebAuthnCredentialRecord}
import com.typesafe.scalalogging.Logger
import com.webauthn4j.data.attestation.statement.COSEAlgorithmIdentifier
import com.webauthn4j.data.{PublicKeyCredentialParameters, PublicKeyCredentialType, RegistrationParameters}
import com.webauthn4j.data.client.Origin
import com.webauthn4j.server.ServerProperty
import io.vertx.core.{Future, Promise}
import io.vertx.core.json.JsonObject
import io.vertx.ext.web.RoutingContext
import jakarta.annotation.security.RolesAllowed
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.core.{Context, MediaType}
import jakarta.ws.rs.{Consumes, POST, Path, Produces}

import java.util
import java.util.Base64
import java.util.concurrent.CompletableFuture
import scala.jdk.CollectionConverters.*
import scala.compiletime.uninitialized

@ApplicationScoped
@Path("security/register/finish")
class RegisterFinishResource extends WebAuthnService {

  val log = Logger[RegisterFinishResource]

  @Inject
  var store: CredentialStore = uninitialized

  @POST
  @Consumes(Array(MediaType.APPLICATION_JSON))
  @Produces(Array(MediaType.APPLICATION_JSON))
  @RolesAllowed(Array("Anonymous"))
  def run(@Context ctx : RoutingContext, entity: JsonObject): CompletableFuture[JsonObject] = {
    val body = Option(ctx.body().asJsonObject()).getOrElse(new JsonObject())
    val publicKeyCredential = body.getJsonObject("publicKeyCredential")
    val credentialId = publicKeyCredential.getString("id")
    val username = body.getString("username")
    val nickName = body.getString("nickName")

    webAuthnManager.parseRegistrationResponseJSON(publicKeyCredential.encode())
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


                store.saveRecord(username, nickName, webAuthnCredentialRecord)
                  .thenApply(_ => {
                    new JsonObject()
                      .put("status", "success")
                      .put("credentialId", credentialId);
                  })
              }

          case None =>
            CompletableFuture.failedFuture(new IllegalStateException("No challenge found for user"))
        }
      }
      .toCompletableFuture
  }

}
