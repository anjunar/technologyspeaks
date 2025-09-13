import {LocalDate} from "@js-joda/core";
import {AbstractEntity, Basic, Entity} from "shared";

@Entity("UserInfo")
export default class UserInfo extends AbstractEntity {

    override $type = "UserInfo"

    @Basic()
    firstName : string

    @Basic()
    lastName : string

    @Basic({
        default : LocalDate.now
    })
    birthDate : LocalDate

}