import {ActiveObject, Primitive, Email, Entity, Mapper, MetaSignal, NotBlank, UIField} from "shared";

@Entity("Login")
export default class Login extends ActiveObject {

    override $type = "Login"

    @UIField({title : "Email", widget : "email"})
    @Email()
    @NotBlank()
    @Primitive({signal : true})
    email : MetaSignal<string>

}