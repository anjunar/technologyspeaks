import {AbstractEntity, Primitive, Entity, NotBlank, Pattern, UIField, Size} from "shared";
import {MetaSignal} from "shared";

@Entity("Address")
export default class Address extends AbstractEntity {

    override $type = "Address"

    @UIField({title : "Street", widget : "text"})
    @Primitive({signal: true})
    @NotBlank()
    @Size({min: 3, max: 20})
    street: MetaSignal<string>

    @UIField({title : "Street Number", widget : "text"})
    @Primitive({signal: true})
    @NotBlank()
    @Size({min: 3, max: 20})
    number: MetaSignal<string>

    @UIField({title : "Zip Code", widget : "text"})
    @Primitive({signal: true})
    @NotBlank()
    @Pattern({regex: "^[0-9]{5}$"})
    zipCode: MetaSignal<string>

    @UIField({title : "Country", widget : "text"})
    @Primitive({signal: true})
    @NotBlank()
    @Size({min: 3, max: 20})
    country: MetaSignal<string>

}