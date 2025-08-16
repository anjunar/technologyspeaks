package com.anjunar.technologyspeaks.security

import com.webauthn4j.async.WebAuthnAsyncManager
import com.webauthn4j.credential.CredentialRecord
import com.webauthn4j.data.client.challenge.Challenge

import java.util.concurrent.ConcurrentHashMap
import java.util

object WebAuthnManagerProvider {

  val webAuthnManager = WebAuthnAsyncManager.createNonStrictWebAuthnAsyncManager()

  val credentialStore = new ConcurrentHashMap[String, util.List[CredentialRecord]]()
  val challengeStore = new ConcurrentHashMap[String, Challenge]()


}
