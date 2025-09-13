import {AbstractSearch, Basic, Entity} from "shared";
import Role from "./Role";

@Entity("CredentialSearch")
export default class CredentialSearch extends AbstractSearch {

    override $type = "CredentialSearch"

    @Basic()
    displayName : string

    @Basic()
    roles : Role[]

}