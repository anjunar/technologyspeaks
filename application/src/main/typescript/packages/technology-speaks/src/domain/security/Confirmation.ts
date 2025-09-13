import {ActiveObject, Basic, Entity} from "shared";

@Entity("Confirmation")
export default class Confirmation extends ActiveObject {

    $type = "Confirmation"

    @Basic()
    code : string

}