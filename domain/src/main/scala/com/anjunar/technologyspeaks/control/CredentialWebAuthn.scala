package com.anjunar.technologyspeaks.control

import com.anjunar.jpa.{EntityContext, RepositoryContext}
import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import jakarta.persistence
import jakarta.persistence.{Basic, Entity}
import org.hibernate.reactive.stage.Stage

import java.{lang, util}
import java.util.UUID
import java.util.concurrent.CompletionStage
import scala.compiletime.uninitialized

@Entity
class CredentialWebAuthn extends Credential with EntityContext[CredentialWebAuthn] {

  @Basic
  @PropertyDescriptor(title = "Device Name", widget = "text")
  var displayName: String = uninitialized

  @Basic
  var credentialId: String = uninitialized

  @Basic
  var publicKey: Array[Byte] = uninitialized

  @Basic
  var publicKeyAlgorithm: Long = uninitialized

  @Basic
  var counter: Long = uninitialized

  @Basic
  var aaguid: UUID = uninitialized

}

object CredentialWebAuthn extends RepositoryContext[CredentialWebAuthn](classOf[CredentialWebAuthn]) {

  def loadByCredentialId(credentialId: String)(implicit session: Stage.Session): CompletionStage[CredentialWebAuthn] = {
    session.createQuery("from CredentialWebAuthn c join fetch c.email join fetch c.roles where c.credentialId = :credentialId", classOf[CredentialWebAuthn])
      .setParameter("credentialId", credentialId)
      .getSingleResultOrNull
  }

  def findByEmail(email: String)(implicit session: Stage.Session): CompletionStage[util.List[CredentialWebAuthn]] = {
    session.createQuery("select c from CredentialWebAuthn c join c.email e where e.value = :email and type(c) = CredentialWebAuthn", classOf[CredentialWebAuthn])
      .setParameter("email", email)
      .getResultList
  }


}