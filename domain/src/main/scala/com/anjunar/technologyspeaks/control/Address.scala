package com.anjunar.technologyspeaks.control

import com.anjunar.jaxrs.types.OwnerProvider
import com.anjunar.jpa.{EntityContext, RepositoryContext}
import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.security.SecurityUser
import com.anjunar.technologyspeaks.shared.AbstractEntity
import com.anjunar.vertx.engine.{EntitySchemaDef, OwnerRule, SchemaProvider}
import jakarta.persistence.{Basic, Entity, OneToOne}
import jakarta.validation.constraints.{NotBlank, NotEmpty, Pattern, Size}
import jakarta.ws.rs.FormParam

import scala.compiletime.uninitialized

@Entity
class Address extends AbstractEntity with EntityContext[Address] with OwnerProvider {

  @OneToOne(mappedBy = "address", targetEntity = classOf[User])
  var user: User = uninitialized

  @Basic
  @Size(min = 3, max = 80)
  @PropertyDescriptor(title = "Street", naming = true)
  @FormParam("street")
  @NotBlank
  var street: String = uninitialized

  @Basic
  @Size(min = 0, max = 10)
  @PropertyDescriptor(title = "House number", naming = true)
  @FormParam("number")
  @NotBlank
  var number: String = uninitialized

  @Basic
  @Pattern(regexp = "^\\d{5,5}$")
  @PropertyDescriptor(title = "Zipcode")
  @FormParam("zipCode")
  @NotBlank
  var zipCode: String = uninitialized

  @Basic
  @Size(min = 3, max = 80)
  @PropertyDescriptor(title = "Country")
  @FormParam("country")
  @NotBlank
  var country: String = uninitialized

  override def owner: SecurityUser = user

  override def toString = s"Address($street, $number, $zipCode, $country)"
}

object Address extends RepositoryContext[Address](classOf[Address]) with SchemaProvider[Address] {

  val schema = EntitySchemaDef(classOf[Address], OwnerRule[Address]())


}