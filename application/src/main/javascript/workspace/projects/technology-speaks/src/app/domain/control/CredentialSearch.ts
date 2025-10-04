import {AbstractSearch, Primitive, Entity} from "shared";
import Role from "./Role";

@Entity("CredentialSearch")
export default class CredentialSearch extends AbstractSearch {

    override $type = "CredentialSearch"

    @Primitive()
    displayName : string

    @Primitive()
    roles : Role[]

}