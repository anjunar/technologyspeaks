import {AbstractSearch, Primitive, Entity} from "shared";

@Entity("GroupSearch")
export default class GroupSearch extends AbstractSearch {

    override $type = "GroupSearch"

    @Primitive()
    name : string

}