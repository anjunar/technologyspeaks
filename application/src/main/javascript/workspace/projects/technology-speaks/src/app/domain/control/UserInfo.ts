import {LocalDate} from "@js-joda/core";
import {AbstractEntity, Basic, Entity, MetaSignal, NotBlank, Past, Schema, Size} from "shared";
import {Media} from "shared";
import OneToOne from "../../../../../shared/src/lib/mapper/annotations/OneToOne";

@Entity("UserInfo")
export default class UserInfo extends AbstractEntity {

    override $type = "UserInfo"

    @Schema({title : "First Name", widget : "text"})
    @Basic({signal: true, type : String})
    @NotBlank()
    @Size({min: 3, max: 20})
    firstName: MetaSignal<string>

    @Schema({title : "Last Name", widget : "text"})
    @Basic({signal: true, type: String})
    @NotBlank()
    @Size({min: 3, max: 20})
    lastName: MetaSignal<string>

    @Schema({title : "Birthdate", widget : "date"})
    @Basic({
        default: LocalDate.now,
        signal: true,
        type: LocalDate
    })
    @Past()
    birthDate: MetaSignal<LocalDate>

    @Schema({title : "Image", widget : "image"})
    @OneToOne({signal: true, targetEntity : Media})
    image: MetaSignal<Media>

}