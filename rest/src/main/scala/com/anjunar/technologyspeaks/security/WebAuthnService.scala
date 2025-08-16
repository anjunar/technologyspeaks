package com.anjunar.technologyspeaks.security

import com.webauthn4j.credential.CredentialRecord
import com.webauthn4j.data.client.challenge.Challenge

import java.util
import java.util.concurrent.ConcurrentHashMap

trait WebAuthnService {

  val webAuthnManager = WebAuthnManagerProvider.webAuthnManager

  val credentialStore = WebAuthnManagerProvider.credentialStore
  val challengeStore = WebAuthnManagerProvider.challengeStore
  val ORIGIN = "http://localhost:8080"
  val RP_ID = "localhost"
  val RP_NAME = "Technology Speaks"


}
