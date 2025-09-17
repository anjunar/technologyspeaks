import {LocalDate} from "@js-joda/core";
import {AbstractEntity, Basic, Entity} from "shared";
import {Signal} from "@angular/core";
import {MetaSignal} from "../../../../../shared/src/lib/meta-signal/meta-signal";

@Entity("UserInfo")
export default class UserInfo extends AbstractEntity {

    override $type = "UserInfo"

    @Basic({signal : true})
    firstName : MetaSignal<string>

    @Basic({signal : true})
    lastName : MetaSignal<string>

    @Basic({
        default : LocalDate.now,
        signal : true
    })
    birthDate : MetaSignal<LocalDate>

}