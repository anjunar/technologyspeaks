import {ActiveObject, Basic, Email, Entity, Mapper, MetaSignal, NotBlank, Schema} from "shared";

@Entity("Login")
export default class Login extends ActiveObject {

    override $type = "Login"

    @Schema({title : "Email", widget : "email"})
    @Email()
    @NotBlank()
    @Basic({signal : true})
    email : MetaSignal<string>

}