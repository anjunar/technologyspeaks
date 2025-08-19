package com.anjunar.technologyspeaks.security

import com.anjunar.technologyspeaks.control.Role
import com.anjunar.vertx.webauthn.CredentialStore
import com.webauthn4j.data.attestation.statement.COSEAlgorithmIdentifier
import com.webauthn4j.data.client.challenge.DefaultChallenge
import com.webauthn4j.data.{PublicKeyCredentialParameters, PublicKeyCredentialType}
import com.webauthn4j.util.Base64UrlUtil
import io.vertx.core.Future
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
import scala.compiletime.uninitialized

@ApplicationScoped
@Path("security/register")
class RegisterOptionsResource extends WebAuthnService {

  @Inject
  var store: CredentialStore = uninitialized

  @POST
  @Consumes(Array(MediaType.APPLICATION_JSON))
  @Produces(Array(MediaType.APPLICATION_JSON))
  @RolesAllowed(Array("Anonymous"))
  def run(@Context ctx: RoutingContext, entity: JsonObject): CompletableFuture[JsonObject] = {
    val body = Option(ctx.body().asJsonObject()).getOrElse(new JsonObject())
    val username = body.getString("username")
    val displayName = body.getString("displayName", username)

    val challengeBytes = new Array[Byte](32)
    new SecureRandom().nextBytes(challengeBytes)
    val challenge = new DefaultChallenge(challengeBytes)
    challengeStore.put(username, challenge)

    val pubKeyCredParams = util.Arrays.asList(
      new PublicKeyCredentialParameters(PublicKeyCredentialType.PUBLIC_KEY, COSEAlgorithmIdentifier.ES256),
      new PublicKeyCredentialParameters(PublicKeyCredentialType.PUBLIC_KEY, COSEAlgorithmIdentifier.RS256)
    )

    store.loadByUsername(username)
      .thenApply(credentials => {
        val excludeCredentials = credentials.stream()
          .map(cred => new JsonObject()
            .put("type", "public-key")
            .put("id", store.credentialId(cred)))
          .toList

        new JsonObject()
          .put("publicKey", new JsonObject()
            .put("challenge", Base64UrlUtil.encodeToString(challengeBytes))
            .put("rp", new JsonObject()
              .put("name", RP_NAME)
              .put("id", RP_ID))
            .put("user", new JsonObject()
              .put("id", Base64UrlUtil.encodeToString(username.getBytes))
              .put("name", username)
              .put("displayName", displayName))
            .put("pubKeyCredParams", new JsonArray()
              .add(new JsonObject().put("type", "public-key").put("alg", -7)) // ES256
              .add(new JsonObject().put("type", "public-key").put("alg", -257))) // RS256
            .put("authenticatorSelection", new JsonObject()
              .put("userVerification", "discouraged")
              .put("requireResidentKey", false))
            .put("attestation", "none")
            .put("timeout", 60000)
            .put("excludeCredentials", new JsonArray(excludeCredentials)))

      })
      .toCompletableFuture
  }

}
