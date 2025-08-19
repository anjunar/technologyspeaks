package com.anjunar.technologyspeaks.security

import com.anjunar.vertx.webauthn.CredentialStore
import com.webauthn4j.data.attestation.statement.COSEAlgorithmIdentifier
import com.webauthn4j.data.{PublicKeyCredentialParameters, PublicKeyCredentialType}
import com.webauthn4j.data.client.challenge.DefaultChallenge
import com.webauthn4j.util.Base64UrlUtil
import io.vertx.core.{Future, Promise}
import io.vertx.core.json.{JsonArray, JsonObject}
import io.vertx.ext.web.RoutingContext
import jakarta.annotation.security.RolesAllowed
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.core.{Context, MediaType}
import jakarta.ws.rs.{Consumes, POST, Path, Produces}

import java.security.SecureRandom
import java.util
import java.util.concurrent.CompletableFuture
import scala.jdk.CollectionConverters.*
import scala.compiletime.uninitialized

@ApplicationScoped
@Path("security/login")
class LoginOptionsResource extends WebAuthnService {

  @Inject
  var store: CredentialStore = uninitialized

  @POST
  @Consumes(Array(MediaType.APPLICATION_JSON))
  @Produces(Array(MediaType.APPLICATION_JSON))
  @RolesAllowed(Array("Anonymous"))
  def run(@Context ctx : RoutingContext, entity: JsonObject): CompletableFuture[JsonObject] = {
    val body = Option(ctx.body().asJsonObject()).getOrElse(new JsonObject())
    val username = body.getString("username")

    val challengeBytes = new Array[Byte](32)
    new SecureRandom().nextBytes(challengeBytes)
    val challenge = new DefaultChallenge(challengeBytes)
    challengeStore.put(username, challenge)

    store.loadByUsername(username)
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
      })
      .toCompletableFuture
    
  }


}
