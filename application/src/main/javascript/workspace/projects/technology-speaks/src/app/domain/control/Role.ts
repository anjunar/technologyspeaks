import {Primitive, Entity, AbstractEntity} from "shared";

@Entity("Role")
export default class Role extends AbstractEntity {

    override $type = "Role"

    @Primitive()
    name : string

    @Primitive()
    description : string

}