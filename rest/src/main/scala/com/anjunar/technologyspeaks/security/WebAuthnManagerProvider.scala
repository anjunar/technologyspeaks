package com.anjunar.technologyspeaks.security

import com.webauthn4j.async.WebAuthnAsyncManager

object WebAuthnManagerProvider {

  val webAuthnManager = WebAuthnAsyncManager.createNonStrictWebAuthnAsyncManager()

}
