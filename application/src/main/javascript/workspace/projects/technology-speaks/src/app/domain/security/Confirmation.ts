import {ActiveObject, Primitive, Entity} from "shared";

@Entity("Confirmation")
export default class Confirmation extends ActiveObject {

    override $type = "Confirmation"

    @Primitive()
    code : string

}