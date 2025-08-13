import {ActiveObject, Basic, Entity} from "react-ui-simplicity";

@Entity("Login")
export default class Login extends ActiveObject {

    $type = "Login"

    @Basic()
    username : string

    @Basic()
    password : string

    @Basic()
    displayName : string

}