import {AbstractEntity, Basic, Entity} from "react-ui-simplicity";
import Group from "../control/Group";

@Entity("ManagedProperty")
export default class ManagedProperty extends AbstractEntity {

    $type = "ManagedProperty"

    @Basic()
    visibleForAll : boolean

    @Basic()
    groups : Group[]

}