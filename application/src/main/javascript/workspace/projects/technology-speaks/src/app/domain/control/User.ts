import Identity from "./Identity";
import UserInfo from "./UserInfo";
import Role from "./Role";
import Address from "./Address";
import {Basic, Entity} from "shared";
import EMail from "./EMail";
import {ModelSignal, Signal} from "@angular/core";

@Entity("User")
export default class User extends Identity {

    override $type = "User"

    @Basic({signal : true})
    nickName : Signal<string>

    @Basic({signal : true})
    emails : Signal<EMail[]>

    @Basic({signal : true})
    info : Signal<UserInfo>

    @Basic({signal : true})
    address : Signal<Address>

    @Basic({signal : true})
    score : Signal<number>

}