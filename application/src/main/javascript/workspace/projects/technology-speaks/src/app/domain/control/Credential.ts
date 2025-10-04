import {AbstractEntity, Primitive, Entity} from "shared";
import Role from "./Role";

@Entity("Credential")
export default class Credential extends AbstractEntity {

    override $type = "Credential"

    @Primitive()
    displayName : string

    @Primitive()
    roles : Role[]

}