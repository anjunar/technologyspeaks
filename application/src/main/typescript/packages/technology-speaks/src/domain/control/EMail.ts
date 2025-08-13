import {Basic, Entity, AbstractEntity} from "react-ui-simplicity";

@Entity("EMail")
export default class EMail extends AbstractEntity {

    $type = "EMail"

    @Basic()
    value : string

}