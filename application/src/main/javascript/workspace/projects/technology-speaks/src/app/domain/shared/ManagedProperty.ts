import {AbstractEntity, Basic, Entity, MetaSignal} from "shared";
import Group from "../control/Group";
import User from "../control/User";
import ManyToMany from "../../../../../shared/src/lib/mapper/annotations/ManyToMany";

@Entity("ManagedProperty")
export default class ManagedProperty extends AbstractEntity {

    override $type = "ManagedProperty"

    @Basic({signal : true})
    visibleForAll : MetaSignal<boolean>

    @ManyToMany({signal : true, targetEntity : Group})
    groups : MetaSignal<Group[]>

    @ManyToMany({signal : true, targetEntity : User})
    users : MetaSignal<User[]>


}