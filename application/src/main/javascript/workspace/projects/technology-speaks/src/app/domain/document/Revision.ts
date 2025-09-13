import {AbstractEntity, Basic, Entity} from "shared";

@Entity("Revision")
export default class Revision extends AbstractEntity {

    override $type = "Revision"

    @Basic()
    title : string

    @Basic()
    revision : number

}