import {MappedSuperclass} from "../../mapper";
import ActiveObject from "./ActiveObject";
import SortObject from "./SortObject";
import Basic from "../../mapper/annotations/Basic";

@MappedSuperclass("abstractSearch")
export default abstract class AbstractSearch extends ActiveObject {

    override $type = "abstractSearch"

    @Basic()
    sort : SortObject[]

    @Basic()
    index : number

    @Basic()
    limit : number


}