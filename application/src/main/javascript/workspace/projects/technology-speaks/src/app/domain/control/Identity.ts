import {Basic, Entity, AbstractEntity} from "shared";

@Entity("Identity")
export default class Identity extends AbstractEntity {

    override $type = "Identity"

    @Basic()
    enabled : boolean

    @Basic()
    deleted : boolean

}