import {AbstractSearch, Basic, Entity} from "react-ui-simplicity";

@Entity("RoleSearch")
export default class RoleSearch extends AbstractSearch {

    $type = "RoleSearch"

    @Basic()
    name : string

    @Basic()
    description : string

}