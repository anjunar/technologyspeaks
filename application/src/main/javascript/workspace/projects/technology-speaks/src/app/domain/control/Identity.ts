import {Primitive, Entity, AbstractEntity} from "shared";

@Entity("Identity")
export default class Identity extends AbstractEntity {

    override $type = "Identity"

    @Primitive()
    enabled : boolean

    @Primitive()
    deleted : boolean

}