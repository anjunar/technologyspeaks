import Identity from "./Identity";
import UserInfo from "./UserInfo";
import Address from "./Address";
import {Basic, Entity, MetaSignal, NotBlank, OneToOne, OneToMany, Schema, Size} from "shared";
import EMail from "./EMail";

@Entity("User")
export default class User extends Identity {

    override $type = "User"

    @Schema({title : "Nickname", widget : "text"})
    @Basic({signal: true, type: "string"})
    @NotBlank()
    @Size({min: 3, max: 20})
    nickName: MetaSignal<string>

    @Schema({title : "Emails", widget : "array"})
    @OneToMany({signal: true, targetEntity: EMail})
    emails: MetaSignal<EMail[]>

    @Schema({title : "Info", widget : "form"})
    @OneToOne({signal: true, targetEntity : UserInfo})
    info: MetaSignal<UserInfo>

    @Schema({title : "Address", widget : "form"})
    @OneToOne({signal: true, targetEntity : Address})
    address: MetaSignal<Address>

    @Schema({title : "Nickname", widget : "text"})
    @Basic({signal: true, type: "number"})
    score: MetaSignal<number>

}