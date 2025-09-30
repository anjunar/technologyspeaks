import {Basic, Entity, AbstractEntity, Schema, Email, NotBlank} from "shared";
import {MetaSignal} from "shared";

@Entity("EMail")
export default class EMail extends AbstractEntity {

    override $type = "EMail"

    @NotBlank()
    @Email()
    @Schema({title : "Email", widget : "email"})
    @Basic({signal : true})
    value : MetaSignal<string>

}