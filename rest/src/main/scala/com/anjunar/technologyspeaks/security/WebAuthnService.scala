package com.anjunar.technologyspeaks.security

trait WebAuthnService {

  val webAuthnManager = WebAuthnManagerProvider.webAuthnManager

  val challengeStore = WebAuthnManagerProvider.challengeStore
  val ORIGIN = "https://technologyspeaks.com"
  val RP_ID = "technologyspeaks.com"
  val RP_NAME = "Technology Speaks"


}
