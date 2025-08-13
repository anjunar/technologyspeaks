package com.anjunar.technologyspeaks

import com.anjunar.technologyspeaks.control.*
import com.typesafe.scalalogging.Logger
import jakarta.annotation.Resource
import jakarta.enterprise.context.{ApplicationScoped, Initialized}
import jakarta.enterprise.event.Observes
import jakarta.transaction.UserTransaction

import java.time.LocalDate
import java.util.Objects
import scala.compiletime.uninitialized


@ApplicationScoped
class DataImport {

  val log: Logger = Logger[DataImport]

  @Resource
  var transaction: UserTransaction = uninitialized

  def init(@Observes @Initialized(classOf[ApplicationScoped]) init: Unit): Unit = {
    transaction.begin()
    var administrator = Role.query(("name", "Administrator"))
    if (Objects.isNull(administrator)) {
      administrator = new Role
      administrator.name = "Administrator"
      administrator.description = "Administrator"
      administrator.saveOrUpdate()
    }
    var user = Role.query(("name", "User"))
    if (Objects.isNull(user)) {
      user = new Role
      user.name = "User"
      user.description = "User"
      user.saveOrUpdate()
    }
    var guest = Role.query(("name", "Guest"))
    if (Objects.isNull(guest)) {
      guest = new Role
      guest.name = "Guest"
      guest.description = "Guest"
      guest.saveOrUpdate()
    }
    var confirmed = Role.query(("name", "Confirmed"))
    if (Objects.isNull(confirmed)) {
      confirmed = new Role
      confirmed.name = "Confirmed"
      confirmed.description = "Confirmed"
      confirmed.saveOrUpdate()
    }


    var patrick = User.findByEmail("anjunar@gmx.de")

    if (Objects.isNull(patrick)) {
      val info = new UserInfo
      info.firstName = "Patrick"
      info.lastName = "Bittner"
      info.birthDate = LocalDate.of(1980, 4, 1)

      val address = new Address
      address.street = "Beim alten Schützenhof"
      address.number = "28"
      address.zipCode = "22083"
      address.country = "Deutschland"

      val token = new Credential
      token.roles.add(administrator)

      val email = new EMail()
      token.email = email

      email.value = "anjunar@gmx.de"
      email.credentials.add(token)

      patrick = new User
      email.user = patrick

      patrick.nickName = "Anjunar"
      patrick.enabled = true
      patrick.deleted = false
      patrick.info = info
      patrick.address = address
      patrick.emails.add(email)

      val passwordCredential = new CredentialPassword
      passwordCredential.password = "patrick"
      passwordCredential.roles.add(administrator)
      email.credentials.add(passwordCredential)

      patrick.saveOrUpdate()
    }

    transaction.commit()

  }
}
