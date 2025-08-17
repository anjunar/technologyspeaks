package com.anjunar.technologyspeaks.security

import com.anjunar.vertx.fsm.services.JsonFSMService
import com.anjunar.vertx.webauthn.CredentialStore
import com.webauthn4j.credential.CredentialRecord
import com.webauthn4j.data.AuthenticationParameters
import com.webauthn4j.data.client.Origin
import com.webauthn4j.server.ServerProperty
import io.vertx.core.Future
import io.vertx.core.json.JsonObject
import io.vertx.ext.auth.User
import io.vertx.ext.web.RoutingContext
import io.vertx.ext.web.handler.SessionHandler
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.hibernate.reactive.stage.Stage

import java.util
import java.util.concurrent.CompletableFuture
import scala.compiletime.uninitialized
import scala.jdk.CollectionConverters.*

@ApplicationScoped
class LoginFinishService extends JsonFSMService[JsonObject] with WebAuthnService {

  @Inject
  var store: CredentialStore = uninitialized

  @Inject
  var sessionFactory: Stage.SessionFactory = uninitialized

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
        store.loadByCredentialId(credentialId)
          .thenCompose(credentialRecord => {
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
                  .thenCompose { _ =>
                    sessionFactory
                      .withTransaction(session => {
                        session.createMutationQuery("update CredentialWebAuthn c set c.counter = : counter where c.credentialId = : credentialId")
                          .setParameter("counter", authenticationData.getAuthenticatorData.getSignCount)
                          .setParameter("credentialId", credentialId)
                          .executeUpdate()
                      })
                      .thenCompose(entity => {
                        store.loadUser(credentialId)
                          .thenApply(user => {
                            val handler = ctx.get[SessionHandler]("sessionHandler")

                            handler.setUser(ctx, user)
                            
                            new JsonObject()
                              .put("status", "success")
                              .put("user", user.principal())
                          })
                      })
                  }
              case None =>
                CompletableFuture.failedFuture(new IllegalStateException("No challenge found for user"))
            }
          })
      })
  }

}
