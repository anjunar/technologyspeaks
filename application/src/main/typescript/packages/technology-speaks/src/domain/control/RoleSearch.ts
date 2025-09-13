import {AbstractSearch, Basic, Entity} from "shared";

@Entity("RoleSearch")
export default class RoleSearch extends AbstractSearch {

    $type = "RoleSearch"

    @Basic()
    name : string

    @Basic()
    description : string

}