import {Entity} from "../../mapper";
import ActiveObject from "./ActiveObject";
import Basic from "../../mapper/annotations/Basic";

@Entity("Sort")
export default class SortObject extends ActiveObject {

    override $type = "Sort"

    @Basic()
    property : string

    @Basic()
    value : string

}