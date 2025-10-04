import {Primitive, Entity, AbstractEntity} from "shared";
import User from "./User";

@Entity("Group")
export default class Group extends AbstractEntity {

    override $type = "Group"

    @Primitive()
    name : string

    @Primitive()
    description : string

    @Primitive()
    users : User[]


}