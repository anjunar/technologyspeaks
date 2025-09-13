import {ActiveObject, Basic, Entity} from "shared";

@Entity("Confirmation")
export default class Confirmation extends ActiveObject {

    override $type = "Confirmation"

    @Basic()
    code : string

}