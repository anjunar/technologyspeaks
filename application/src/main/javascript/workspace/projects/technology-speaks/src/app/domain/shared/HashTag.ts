import {AbstractEntity, Basic, Entity} from "shared";

@Entity("HashTag")
export default class HashTag extends AbstractEntity {

    override $type = "HashTag"

    @Basic()
    value : string

    @Basic()
    description : string


}