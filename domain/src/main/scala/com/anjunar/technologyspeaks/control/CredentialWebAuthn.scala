package com.anjunar.technologyspeaks.control

import com.anjunar.hibernate.reactive.UUIDConverter
import com.anjunar.jpa.{EntityContext, RepositoryContext}
import com.anjunar.scala.mapper.annotations.{Converter, PropertyDescriptor}
import com.anjunar.technologyspeaks.shared.editor.RootType
import com.webauthn4j.credential.CredentialRecord
import com.webauthn4j.data.AuthenticatorTransport
import com.webauthn4j.data.attestation.AttestationObject
import com.webauthn4j.data.attestation.authenticator.AttestedCredentialData
import com.webauthn4j.data.client.CollectedClientData
import io.smallrye.mutiny.Uni
import jakarta.enterprise.inject.spi.Bean
import jakarta.persistence
import jakarta.persistence.{Basic, Column, Convert, Entity, Lob, NoResultException}
import org.hibernate.Session
import org.hibernate.annotations.Type

import java.security.SecureRandom
import java.util
import java.util.{Base64, UUID}
import java.lang
import java.util.concurrent.CompletionStage
import scala.beans.{BeanProperty, BooleanBeanProperty}
import scala.compiletime.uninitialized

@Entity
class CredentialWebAuthn extends Credential with EntityContext[CredentialWebAuthn] {

  @Basic
  @PropertyDescriptor(title = "Device Name", widget = "text")
  var displayName: String = uninitialized

  @Basic
  var credentialId: String = uninitialized

  @Basic
  var publicKey : Array[Byte] = uninitialized

  @Basic
  var publicKeyAlgorithm : Long = uninitialized

  @Basic
  var counter: Long = uninitialized

  @Basic
  var aaguid : UUID = uninitialized

}

object CredentialWebAuthn extends RepositoryContext[CredentialWebAuthn](classOf[CredentialWebAuthn]) {

  def loadByCredentialId(credentialId : String) : CompletionStage[CredentialWebAuthn] = {
    withTransaction(session => {
      session.createQuery("from CredentialWebAuthn c join fetch c.email join fetch c.roles where c.credentialId = :credentialId", classOf[CredentialWebAuthn])
        .setParameter("credentialId", credentialId)
        .getSingleResultOrNull
    })
  }

  def findByEmail(email: String): CompletionStage[util.List[CredentialWebAuthn]] = {
    withTransaction(session => {
      session.createQuery("select c from CredentialWebAuthn c join c.email e where e.value = :email and type(c) = CredentialWebAuthn", classOf[CredentialWebAuthn])
        .setParameter("email", email)
        .getResultList
    })
  }


}