import {AbstractEntity, Basic, Entity} from "shared";
import Role from "./Role";

@Entity("Credential")
export default class Credential extends AbstractEntity {

    $type = "Credential"

    @Basic()
    displayName : string

    @Basic()
    roles : Role[]

}