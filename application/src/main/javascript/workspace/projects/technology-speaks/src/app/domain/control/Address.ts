import {AbstractEntity, Basic, Entity, NotBlank, Pattern, Schema, Size} from "shared";
import {MetaSignal} from "shared";

@Entity("Address")
export default class Address extends AbstractEntity {

    override $type = "Address"

    @Schema({title : "Nickname", widget : "text"})
    @Basic({signal: true})
    @NotBlank()
    @Size({min: 3, max: 20})
    street: MetaSignal<string>

    @Schema({title : "Nickname", widget : "text"})
    @Basic({signal: true})
    @NotBlank()
    @Size({min: 3, max: 20})
    number: MetaSignal<string>

    @Schema({title : "Nickname", widget : "text"})
    @Basic({signal: true})
    @NotBlank()
    @Pattern({regex: "^[0-9]{5}$"})
    zipCode: MetaSignal<string>

    @Schema({title : "Nickname", widget : "text"})
    @Basic({signal: true})
    @NotBlank()
    @Size({min: 3, max: 20})
    country: MetaSignal<string>

}