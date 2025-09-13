import {AbstractEntity, Basic, Entity} from "shared";
import Group from "../control/Group";

@Entity("ManagedProperty")
export default class ManagedProperty extends AbstractEntity {

    $type = "ManagedProperty"

    @Basic()
    visibleForAll : boolean

    @Basic()
    groups : Group[]

}