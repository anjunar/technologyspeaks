import {AbstractSearch, Basic, Entity} from "shared";

@Entity("GroupSearch")
export default class GroupSearch extends AbstractSearch {

    override $type = "GroupSearch"

    @Basic()
    name : string

}