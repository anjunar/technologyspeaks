package com.anjunar.technologyspeaks.control

import com.anjunar.jpa.{EntityContext, RepositoryContext}
import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.scala.schema.engine.EntitySchemaDef
import com.anjunar.technologyspeaks.shared.AbstractEntity
import jakarta.persistence.{Basic, CascadeType, Embedded, Entity, OneToOne}
import jakarta.validation.constraints.{NotBlank, Pattern, Size}
import jakarta.ws.rs.FormParam

import java.util.UUID
import scala.compiletime.uninitialized

@Entity
class Address extends AbstractEntity with EntityContext[Address] {

  @OneToOne(mappedBy = "address", targetEntity = classOf[User])
  var user : User = uninitialized

  @Basic
  @Size(min = 3, max = 80)
  @PropertyDescriptor(title = "Street", naming = true)
  @FormParam("street")
  var street : String = uninitialized

  @Basic
  @Size(min = 0, max = 10)
  @PropertyDescriptor(title = "House number", naming = true)
  @FormParam("number")
  var number : String = uninitialized

  @Basic
  @Pattern(regexp = "^\\d{5,5}$")
  @PropertyDescriptor(title = "Zipcode")
  @FormParam("zipCode")
  var zipCode : String = uninitialized

  @Basic
  @Size(min = 3, max = 80)
  @PropertyDescriptor(title = "Country")
  @FormParam("country")
  var country : String = uninitialized
  
  override def toString = s"Address($street, $number, $zipCode, $country)"
}

object Address extends RepositoryContext[Address](classOf[Address]) {

  val schema = new EntitySchemaDef[Address]("Address") {
    val id = column[UUID]("id")
    val street = column[String]("street")
    val number = column[String]("number")
    val zipCode = column[String]("zipCode")
    val country = column[String]("country")
  }


}