import {LocalDate} from "@js-joda/core";
import {AbstractEntity, Basic, Entity, Media} from "react-ui-simplicity";

@Entity("UserInfo")
export default class UserInfo extends AbstractEntity {

    $type = "UserInfo"

    @Basic()
    firstName : string

    @Basic()
    lastName : string

    @Basic({
        default : null
    })
    image : Media

    @Basic({
        default : LocalDate.now
    })
    birthDate : LocalDate

}