import Identity from "./Identity";
import UserInfo from "./UserInfo";
import Address from "./Address";
import {Primitive, Entity, MetaSignal, NotBlank, Reference, Collection, UIField, Size} from "shared";
import EMail from "./EMail";

@Entity("User")
export default class User extends Identity {

    override $type = "User"

    @UIField({title : "Nickname", widget : "text"})
    @Primitive({signal: true, type: "string"})
    @NotBlank()
    @Size({min: 3, max: 20})
    nickName: MetaSignal<string>

    @UIField({title : "Emails", widget : "array"})
    @Collection({signal: true, targetEntity: EMail})
    emails: MetaSignal<EMail[]>

    @UIField({title : "Info", widget : "form"})
    @Reference({signal: true, targetEntity : UserInfo})
    info: MetaSignal<UserInfo>

    @UIField({title : "Address", widget : "form"})
    @Reference({signal: true, targetEntity : Address})
    address: MetaSignal<Address>

    @UIField({title : "Nickname", widget : "text"})
    @Primitive({signal: true, type: "number"})
    score: MetaSignal<number>

}