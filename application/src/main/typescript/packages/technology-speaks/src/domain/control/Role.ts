import {Basic, Entity, AbstractEntity} from "react-ui-simplicity";

@Entity("Role")
export default class Role extends AbstractEntity {

    $type = "Role"

    @Basic()
    name : string

    @Basic()
    description : string

}