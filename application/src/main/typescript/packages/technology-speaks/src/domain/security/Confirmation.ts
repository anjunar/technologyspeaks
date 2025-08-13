import {ActiveObject, Basic, Entity} from "react-ui-simplicity";

@Entity("Confirmation")
export default class Confirmation extends ActiveObject {

    $type = "Confirmation"

    @Basic()
    code : string

}