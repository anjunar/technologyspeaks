import {Entity} from "../../mapper";
import ActiveObject from "./ActiveObject";
import Primitive from "../../mapper/annotations/Primitive";

@Entity("Sort")
export default class Sort extends ActiveObject {

    override $type = "Sort"

    @Primitive()
    property : string

    @Primitive()
    value : string

}