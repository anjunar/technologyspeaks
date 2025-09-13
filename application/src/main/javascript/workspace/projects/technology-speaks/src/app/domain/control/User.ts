import Identity from "./Identity";
import UserInfo from "./UserInfo";
import Role from "./Role";
import Address from "./Address";
import {Basic, Entity} from "shared";
import EMail from "./EMail";

@Entity("User")
export default class User extends Identity {

    override $type = "User"

    @Basic()
    nickName : string

    @Basic()
    emails : EMail[] = []

    @Basic()
    info : UserInfo

    @Basic()
    address : Address

    @Basic()
    score : number

}