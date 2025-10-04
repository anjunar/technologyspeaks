import {LocalDate} from "@js-joda/core";
import {AbstractEntity, Primitive, Entity, MetaSignal, NotBlank, Past, UIField, Size} from "shared";
import {Media} from "shared";
import Reference from "../../../../../shared/src/lib/mapper/annotations/Reference";

@Entity("UserInfo")
export default class UserInfo extends AbstractEntity {

    override $type = "UserInfo"

    @UIField({title : "First Name", widget : "text"})
    @Primitive({signal: true, type : String})
    @NotBlank()
    @Size({min: 3, max: 20})
    firstName: MetaSignal<string>

    @UIField({title : "Last Name", widget : "text"})
    @Primitive({signal: true, type: String})
    @NotBlank()
    @Size({min: 3, max: 20})
    lastName: MetaSignal<string>

    @UIField({title : "Birthdate", widget : "date"})
    @Primitive({
        default: LocalDate.now,
        signal: true,
        type: LocalDate
    })
    @Past()
    birthDate: MetaSignal<LocalDate>

    @UIField({title : "Image", widget : "image"})
    @Reference({signal: true, targetEntity : Media})
    image: MetaSignal<Media>

}