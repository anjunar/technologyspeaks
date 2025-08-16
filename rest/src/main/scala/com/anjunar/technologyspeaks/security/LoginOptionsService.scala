package com.anjunar.technologyspeaks.security

import com.anjunar.vertx.fsm.services.JsonFSMService
import com.anjunar.vertx.webauthn.CredentialStore
import com.webauthn4j.data.attestation.statement.COSEAlgorithmIdentifier
import com.webauthn4j.data.{PublicKeyCredentialParameters, PublicKeyCredentialType}
import com.webauthn4j.data.client.challenge.DefaultChallenge
import com.webauthn4j.util.Base64UrlUtil
import io.vertx.core.{Future, Promise}
import io.vertx.core.json.{JsonArray, JsonObject}
import io.vertx.ext.web.RoutingContext
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

import java.security.SecureRandom
import java.util
import scala.jdk.CollectionConverters.*
import scala.compiletime.uninitialized

@ApplicationScoped
class LoginOptionsService extends JsonFSMService[JsonObject]  with WebAuthnService {

  @Inject
  var store: CredentialStore = uninitialized

  override def run(ctx : RoutingContext, entity: JsonObject): Future[JsonObject] = {
    val body = Option(ctx.body().asJsonObject()).getOrElse(new JsonObject())
    val username = body.getString("username")

    val challengeBytes = new Array[Byte](32)
    new SecureRandom().nextBytes(challengeBytes)
    val challenge = new DefaultChallenge(challengeBytes)
    challengeStore.put(username, challenge)

    Future.fromCompletionStage(store.loadByUsername(username)
      .thenApply(credentials => {
        val allowCredentials = credentials
          .stream().map(cred => new JsonObject()
            .put("type", "public-key")
            .put("id", store.credentialId(cred)))
          .toList

        new JsonObject()
          .put("publicKey", new JsonObject()
            .put("challenge", Base64UrlUtil.encodeToString(challengeBytes))
            .put("rpId", RP_ID)
            .put("allowCredentials", new JsonArray(allowCredentials))
            .put("userVerification", "discouraged")
            .put("timeout", 60000))
      }))
    
  }


}
