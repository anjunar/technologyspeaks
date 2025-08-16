package com.anjunar.technologyspeaks.control

import com.anjunar.jpa.RepositoryContext
import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import io.smallrye.mutiny.Uni
import jakarta.persistence.{Basic, Entity, NoResultException}
import org.hibernate.Session

import java.security.SecureRandom
import java.util
import java.util.Base64
import java.lang
import java.util.concurrent.CompletionStage
import scala.beans.BeanProperty
import scala.compiletime.uninitialized

@Entity
class CredentialWebAuthn extends Credential {

  @Basic
  @PropertyDescriptor(title = "Device Name", widget = "text")
  var displayName: String = uninitialized

  @Basic
  var credentialId: String = uninitialized
  
  @Basic
  var aaguid : String = uninitialized
  
  @Basic
  var publicKey : String = uninitialized

  @Basic
  var signCount: lang.Long = uninitialized

  @Basic
  var flags : Int = uninitialized
  
  @Basic
  var `type` : String = uninitialized
  
  @Basic
  var fmt : String = uninitialized

  @Basic
  var oneTimeToken: String = uninitialized

  override def toString = s"WebAuthnCredential($displayName, $signCount)"

}

object CredentialWebAuthn extends RepositoryContext[CredentialWebAuthn](classOf[CredentialWebAuthn]) {

  def findByEmail(email : String) : CompletionStage[util.List[CredentialWebAuthn]] = {
    sessionFactory.withTransaction(session => {
      session.createQuery("select c from EMail e join e.credentials c where e.value = :email", classOf[CredentialWebAuthn])
        .setParameter("email", email)
        .getResultList
    })
  }

  def findByCredential(credential : String, callback: CredentialWebAuthn => CredentialWebAuthn = entity => entity) : CompletionStage[CredentialWebAuthn] = {
    sessionFactory.withTransaction(session => {
      session.createQuery("select c from CredentialWebAuthn c where c.credentialId = :credential", classOf[CredentialWebAuthn])
        .setParameter("credential", credential)
        .getSingleResult
        .thenApply(entity => callback(entity))
    })
  }

  def upsert(credential : CredentialWebAuthn): CompletionStage[CredentialWebAuthn] = {
    sessionFactory.withTransaction(session => {
      session.merge(credential)
    })
  }

}