import {ActiveObject, Basic, Entity} from "shared";

@Entity("Login")
export default class Login extends ActiveObject {

    override $type = "Login"

    @Basic()
    username : string

    @Basic()
    password : string

    @Basic()
    displayName : string

}