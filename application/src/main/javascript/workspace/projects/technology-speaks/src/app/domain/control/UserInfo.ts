import {LocalDate} from "@js-joda/core";
import {AbstractEntity, Basic, Entity, MetaSignal} from "shared";
import {Media} from "shared";
import OneToOne from "../../../../../shared/src/lib/mapper/annotations/OneToOne";

@Entity("UserInfo")
export default class UserInfo extends AbstractEntity {

    override $type = "UserInfo"

    @Basic({signal: true, type : String})
    firstName: MetaSignal<string>

    @Basic({signal: true, type: String})
    lastName: MetaSignal<string>

    @Basic({
        default: LocalDate.now,
        signal: true,
        type: LocalDate
    })
    birthDate: MetaSignal<LocalDate>

    @OneToOne({signal: true, targetEntity : Media})
    image: MetaSignal<Media>

}