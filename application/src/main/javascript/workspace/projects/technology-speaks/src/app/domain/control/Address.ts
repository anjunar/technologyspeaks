import {AbstractEntity, Basic, Entity, NotBlank, Pattern, Schema, Size} from "shared";
import {MetaSignal} from "shared";

@Entity("Address")
export default class Address extends AbstractEntity {

    override $type = "Address"

    @Schema({title : "Street", widget : "text"})
    @Basic({signal: true})
    @NotBlank()
    @Size({min: 3, max: 20})
    street: MetaSignal<string>

    @Schema({title : "Street Number", widget : "text"})
    @Basic({signal: true})
    @NotBlank()
    @Size({min: 3, max: 20})
    number: MetaSignal<string>

    @Schema({title : "Zip Code", widget : "text"})
    @Basic({signal: true})
    @NotBlank()
    @Pattern({regex: "^[0-9]{5}$"})
    zipCode: MetaSignal<string>

    @Schema({title : "Country", widget : "text"})
    @Basic({signal: true})
    @NotBlank()
    @Size({min: 3, max: 20})
    country: MetaSignal<string>

}