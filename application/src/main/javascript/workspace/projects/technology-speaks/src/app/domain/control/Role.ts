import {Basic, Entity, AbstractEntity} from "shared";

@Entity("Role")
export default class Role extends AbstractEntity {

    override $type = "Role"

    @Basic()
    name : string

    @Basic()
    description : string

}