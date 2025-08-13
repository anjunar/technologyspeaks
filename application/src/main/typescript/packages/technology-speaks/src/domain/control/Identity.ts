import {Basic, Entity, AbstractEntity} from "react-ui-simplicity";

@Entity("Identity")
export default class Identity extends AbstractEntity {

    $type = "Identity"

    @Basic()
    enabled : boolean

    @Basic()
    deleted : boolean

}