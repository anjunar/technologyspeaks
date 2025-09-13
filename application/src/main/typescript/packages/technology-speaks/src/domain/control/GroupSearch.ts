import {AbstractSearch, Basic, Entity} from "shared";

@Entity("GroupSearch")
export default class GroupSearch extends AbstractSearch {

    $type = "GroupSearch"

    @Basic()
    name : string

}