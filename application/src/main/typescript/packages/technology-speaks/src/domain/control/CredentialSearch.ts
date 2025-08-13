import {AbstractSearch, Basic, Entity} from "react-ui-simplicity";
import Role from "./Role";

@Entity("CredentialSearch")
export default class CredentialSearch extends AbstractSearch {

    $type = "CredentialSearch"

    @Basic()
    displayName : string

    @Basic()
    roles : Role[]

}