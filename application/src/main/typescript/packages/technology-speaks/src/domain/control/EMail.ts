import {Basic, Entity, AbstractEntity} from "shared";

@Entity("EMail")
export default class EMail extends AbstractEntity {

    $type = "EMail"

    @Basic()
    value : string

}