import Identity from "./Identity";
import UserInfo from "./UserInfo";
import Role from "./Role";
import Address from "./Address";
import {Basic, Entity} from "shared";
import EMail from "./EMail";
import {ModelSignal, Signal} from "@angular/core";
import {MetaSignal} from "../../../../../shared/src/lib/meta-signal/meta-signal";

@Entity("User")
export default class User extends Identity {

    override $type = "User"

    @Basic({signal : true})
    nickName : MetaSignal<string>

    @Basic({signal : true})
    emails : MetaSignal<EMail[]>

    @Basic({signal : true})
    info : MetaSignal<UserInfo>

    @Basic({signal : true})
    address : MetaSignal<Address>

    @Basic({signal : true})
    score : MetaSignal<number>

}