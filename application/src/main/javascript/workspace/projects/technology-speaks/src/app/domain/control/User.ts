import Identity from "./Identity";
import UserInfo from "./UserInfo";
import Address from "./Address";
import {Basic, Entity, MetaSignal} from "shared";
import EMail from "./EMail";

@Entity("User")
export default class User extends Identity {

    override $type = "User"

    @Basic({signal: true})
    nickName: MetaSignal<string>

    @Basic({signal: true})
    emails: MetaSignal<EMail[]>

    @Basic({signal: true})
    info: MetaSignal<UserInfo>

    @Basic({signal: true})
    address: MetaSignal<Address>

    @Basic({signal: true})
    score: MetaSignal<number>

}