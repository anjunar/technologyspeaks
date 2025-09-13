import {AbstractSearch, Basic, Entity} from "shared";

@Entity("RoleSearch")
export default class RoleSearch extends AbstractSearch {

    override $type = "RoleSearch"

    @Basic()
    name : string

    @Basic()
    description : string

}