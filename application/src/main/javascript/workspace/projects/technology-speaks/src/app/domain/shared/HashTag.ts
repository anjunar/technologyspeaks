import {AbstractEntity, Primitive, Entity} from "shared";

@Entity("HashTag")
export default class HashTag extends AbstractEntity {

    override $type = "HashTag"

    @Primitive()
    value : string

    @Primitive()
    description : string


}