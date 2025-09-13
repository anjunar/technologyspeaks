import {AbstractSearch, Basic, Entity} from "shared";
import {LocalDate} from "@js-joda/core";

@Entity("UserSearch")
export default class UserSearch extends AbstractSearch {

    override $type = "UserSearch"

    @Basic()
    email : string

    @Basic()
    name : string

    @Basic()
    birthDate : LocalDate

}