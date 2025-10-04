import {AbstractSearch, Primitive, Entity} from "shared";
import {LocalDate} from "@js-joda/core";

@Entity("UserSearch")
export default class UserSearch extends AbstractSearch {

    override $type = "UserSearch"

    @Primitive()
    email : string

    @Primitive()
    name : string

    @Primitive()
    birthDate : LocalDate

}