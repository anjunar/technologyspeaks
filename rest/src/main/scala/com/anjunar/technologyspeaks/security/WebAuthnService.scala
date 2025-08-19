package com.anjunar.technologyspeaks.security

trait WebAuthnService {

  val webAuthnManager = WebAuthnManagerProvider.webAuthnManager

  val challengeStore = WebAuthnManagerProvider.challengeStore
  val ORIGIN = "http://localhost"
  val RP_ID = "localhost"
  val RP_NAME = "Technology Speaks"


}
