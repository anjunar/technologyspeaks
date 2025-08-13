package com.anjunar.technologyspeaks.control

import com.anjunar.jaxrs.types.OwnerProvider
import com.anjunar.jpa.RepositoryContext
import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.security.SecurityUser
import com.anjunar.jpa.{PostgresIndex, PostgresIndices}
import com.anjunar.technologyspeaks.shared.property.EntityView
import jakarta.persistence.*
import jakarta.validation.constraints.*
import jakarta.ws.rs.FormParam

import java.util
import java.util.Objects
import scala.compiletime.uninitialized


@Entity
@PostgresIndices(Array(
  new PostgresIndex(name = "user_idx_nickName", columnList = "nickName", using = "GIN")
))
class User extends Identity with OwnerProvider with SecurityUser {

  @Size(min = 3, max = 80)
  @PropertyDescriptor(title = "Nickname", naming = true)
  @Column(unique = true)
  @Basic
  @FormParam("nickName")
  var nickName: String = uninitialized

  @OneToMany(cascade = Array(CascadeType.ALL), mappedBy = "user")
  @PropertyDescriptor(title = "Emails", widget = "form-array", writeable = true)
  val emails: util.Set[EMail] = new util.HashSet[EMail]()

  @OneToOne(cascade = Array(CascadeType.ALL), orphanRemoval = true, targetEntity = classOf[UserInfo])
  @PropertyDescriptor(title = "Info", naming = true)
  var info: UserInfo = uninitialized

  @OneToOne(cascade = Array(CascadeType.ALL), orphanRemoval = true, targetEntity = classOf[Address])
  @PropertyDescriptor(title = "Address")
  var address: Address = uninitialized

  override def owner: User = this

  override def toString = s"User($nickName)"
}

object User extends RepositoryContext[User](classOf[User]) {

  def current(): User = {
    val token = Credential.current()
    token.email.user
  }

  def findByEmail(email: String): User = {
    try
      User.query("select u from User u join u.emails e where e.value = :value")
        .setParameter("value", email)
        .getSingleResult
    catch
      case e: NoResultException => null
  }

  @Entity(name = "UserView")
  class View extends EntityView {

    override def toString = s"View()"
  }

  object View extends RepositoryContext[View](classOf[View]) {
    def findByUser(user: User): View = {
      if (user.isPersistent) {
        try {
          User.View.query("select v from UserView v where v.user = :user")
            .setParameter("user", user)
            .getSingleResult
        } catch {
          case e: NoResultException => {
            val view = new View()
            view.user = user
            view.saveOrUpdate()
            view
          }
        }
      } else {
        null
      }
    }
  }

}