import {AbstractEntity, Basic, Entity, MetaSignal, Schema} from "shared";
import Group from "../control/Group";
import User from "../control/User";
import {ManyToMany} from "shared";

@Entity("ManagedProperty")
export default class ManagedProperty extends AbstractEntity {

    override $type = "ManagedProperty"

    @Schema({title : "Name", widget : "checkbox"})
    @Basic({signal : true})
    visibleForAll : MetaSignal<boolean>

    @Schema({title : "Groups", widget : "lazy-select"})
    @ManyToMany({signal : true, targetEntity : Group, default : []})
    groups : MetaSignal<Group[]>

    @Schema({title : "Users", widget : "lazy-select", link : "/service/control/users"})
    @ManyToMany({signal : true, targetEntity : User, default : []})
    users : MetaSignal<User[]>

}