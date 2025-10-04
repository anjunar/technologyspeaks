import {AbstractEntity, Primitive, Entity} from "shared";

@Entity("Revision")
export default class Revision extends AbstractEntity {

    override $type = "Revision"

    @Primitive()
    title : string

    @Primitive()
    revision : number

}