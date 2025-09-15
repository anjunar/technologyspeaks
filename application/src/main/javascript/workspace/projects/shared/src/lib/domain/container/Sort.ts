import {Entity} from "../../mapper";
import ActiveObject from "./ActiveObject";
import Basic from "../../mapper/annotations/Basic";

@Entity("Sort")
export default class Sort extends ActiveObject {

    override $type = "Sort"

    @Basic()
    property : string

    @Basic()
    value : string

}