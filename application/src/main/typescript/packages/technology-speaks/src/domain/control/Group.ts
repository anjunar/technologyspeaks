import {Basic, Entity, AbstractEntity} from "react-ui-simplicity";
import User from "./User";

@Entity("Group")
export default class Group extends AbstractEntity {

    $type = "Group"

    @Basic()
    name : string

    @Basic()
    description : string

    @Basic()
    users : User[]


}