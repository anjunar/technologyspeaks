package com.anjunar.vertx.webauthn

import com.webauthn4j.credential.CredentialRecord
import com.webauthn4j.data.RegistrationData
import io.vertx.core.CompositeFuture
import io.vertx.ext.auth.User

import java.util
import java.util.concurrent.CompletionStage

trait CredentialStore {

  def credentialId(record : CredentialRecord): String
  
  def loadUser(credentialId : String) : CompletionStage[User]
  
  def saveRecord(credentialId : String, nickName : String, record : WebAuthnCredentialRecord) : CompletionStage[Void]
  
  def loadByUsername(username: String): CompletionStage[util.List[? <: CredentialRecord]]

  def loadByCredentialId(credentialId: String): CompletionStage[? <: CredentialRecord]

}
