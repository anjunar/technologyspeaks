package com.anjunar.technologyspeaks.security

import com.anjunar.vertx.fsm.services.JsonFSMService
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

  override def run(ctx : RoutingContext, entity: JsonObject): Future[JsonObject] = {
    val body = Option(ctx.body().asJsonObject()).getOrElse(new JsonObject())
    val username = body.getString("username")

    val challengeBytes = new Array[Byte](32)
    new SecureRandom().nextBytes(challengeBytes)
    val challenge = new DefaultChallenge(challengeBytes)
    challengeStore.put(username, challenge)

    val allowCredentials = Option(credentialStore.get(username))
      .map(_.asScala.map(cred => new JsonObject()
        .put("type", "public-key")
        .put("id", cred.asInstanceOf[CredentialRecordImpl].getCredentialId)))
      .getOrElse(Seq.empty)
      .asJava

    val response = new JsonObject()
      .put("publicKey", new JsonObject()
        .put("challenge", Base64UrlUtil.encodeToString(challengeBytes))
        .put("rpId", RP_ID)
        .put("allowCredentials", new JsonArray(allowCredentials))
        .put("userVerification", "discouraged")
        .put("timeout", 60000))

    val promise = Promise.promise[JsonObject]()
    promise.succeed(response)
    
    promise.future()
  }


}
