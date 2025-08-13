import {AbstractEntity, Basic, Entity} from "react-ui-simplicity";

@Entity("HashTag")
export default class HashTag extends AbstractEntity {

    $type = "HashTag"

    @Basic()
    value : string

    @Basic()
    description : string


}