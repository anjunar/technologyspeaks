import Identity from "./Identity";
import UserInfo from "./UserInfo";
import Address from "./Address";
import {Basic, Entity, MetaSignal} from "shared";
import EMail from "./EMail";
import OneToOne from "../../../../../shared/src/lib/mapper/annotations/OneToOne";
import OneToMany from "../../../../../shared/src/lib/mapper/annotations/OneToMany";

@Entity("User")
export default class User extends Identity {

    override $type = "User"

    @Basic({signal: true, type: "string"})
    nickName: MetaSignal<string>

    @OneToMany({signal: true, targetEntity: EMail})
    emails: MetaSignal<EMail[]>

    @OneToOne({signal: true, targetEntity : UserInfo})
    info: MetaSignal<UserInfo>

    @OneToOne({signal: true, targetEntity : Address})
    address: MetaSignal<Address>

    @Basic({signal: true, type: "number"})
    score: MetaSignal<number>

}