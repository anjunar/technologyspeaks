import {AbstractSearch, Primitive, Entity} from "shared";

@Entity("RoleSearch")
export default class RoleSearch extends AbstractSearch {

    override $type = "RoleSearch"

    @Primitive()
    name : string

    @Primitive()
    description : string

}