import {AbstractEntity, Basic, Entity} from "shared";
import Role from "./Role";

@Entity("Credential")
export default class Credential extends AbstractEntity {

    override $type = "Credential"

    @Basic()
    displayName : string

    @Basic()
    roles : Role[]

}