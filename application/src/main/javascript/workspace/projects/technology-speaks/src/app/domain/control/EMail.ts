import {Primitive, Entity, AbstractEntity, UIField, Email, NotBlank} from "shared";
import {MetaSignal} from "shared";

@Entity("EMail")
export default class EMail extends AbstractEntity {

    override $type = "EMail"

    @NotBlank()
    @Email()
    @UIField({title : "Email", widget : "email"})
    @Primitive({signal : true})
    value : MetaSignal<string>

}