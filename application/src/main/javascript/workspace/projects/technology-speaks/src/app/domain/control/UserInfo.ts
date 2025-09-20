import {LocalDate} from "@js-joda/core";
import {AbstractEntity, Basic, Entity, MetaSignal} from "shared";
import {Media} from "shared";

@Entity("UserInfo")
export default class UserInfo extends AbstractEntity {

    override $type = "UserInfo"

    @Basic({signal: true})
    firstName: MetaSignal<string>

    @Basic({signal: true})
    lastName: MetaSignal<string>

    @Basic({
        default: LocalDate.now,
        signal: true
    })
    birthDate: MetaSignal<LocalDate>

    @Basic({signal: true})
    image: MetaSignal<Media>

}