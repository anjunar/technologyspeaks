import {Basic, Entity, AbstractEntity} from "shared";
import User from "./User";

@Entity("Group")
export default class Group extends AbstractEntity {

    override $type = "Group"

    @Basic()
    name : string

    @Basic()
    description : string

    @Basic()
    users : User[]


}