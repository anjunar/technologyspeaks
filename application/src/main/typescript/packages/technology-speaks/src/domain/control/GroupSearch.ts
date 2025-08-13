import {AbstractSearch, Basic, Entity} from "react-ui-simplicity";

@Entity("GroupSearch")
export default class GroupSearch extends AbstractSearch {

    $type = "GroupSearch"

    @Basic()
    name : string

}