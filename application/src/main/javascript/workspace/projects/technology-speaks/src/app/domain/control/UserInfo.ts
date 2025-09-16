import {LocalDate} from "@js-joda/core";
import {AbstractEntity, Basic, Entity} from "shared";
import {Signal} from "@angular/core";

@Entity("UserInfo")
export default class UserInfo extends AbstractEntity {

    override $type = "UserInfo"

    @Basic({signal : true})
    firstName : Signal<string>

    @Basic({signal : true})
    lastName : Signal<string>

    @Basic({
        default : LocalDate.now,
        signal : true
    })
    birthDate : Signal<LocalDate>

}