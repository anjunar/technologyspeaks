import {AbstractEntity, Collection, Entity, MetaSignal, Primitive, UIField} from "shared";
import Group from "../control/Group";
import User from "../control/User";

@Entity("ManagedProperty")
export default class ManagedProperty extends AbstractEntity {

    override $type = "ManagedProperty"

    @UIField({title: "Name", widget: "checkbox"})
    @Primitive({signal: true})
    visibleForAll: MetaSignal<boolean>

    @UIField({title: "Groups", widget: "lazy-select"})
    @Collection({signal: true, targetEntity: Group, default: []})
    groups: MetaSignal<Group[]>

    @UIField({title: "Users", widget: "lazy-select", link: "/service/control/users"})
    @Collection({signal: true, targetEntity: User, default: []})
    users: MetaSignal<User[]>

}