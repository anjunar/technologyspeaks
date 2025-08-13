import {AbstractSearch, Basic, Entity} from "react-ui-simplicity";
import {LocalDate} from "@js-joda/core";

@Entity("UserSearch")
export default class UserSearch extends AbstractSearch {

    $type = "UserSearch"

    @Basic()
    email : string

    @Basic()
    name : string

    @Basic()
    birthDate : LocalDate

}