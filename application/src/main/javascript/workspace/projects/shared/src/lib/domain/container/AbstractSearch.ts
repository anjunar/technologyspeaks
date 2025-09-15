import {MappedSuperclass} from "../../mapper";
import ActiveObject from "./ActiveObject";
import Sort from "./Sort";
import Basic from "../../mapper/annotations/Basic";

@MappedSuperclass("abstractSearch")
export default abstract class AbstractSearch extends ActiveObject {

    override $type = "abstractSearch"

    @Basic()
    sort : Sort[]

    @Basic()
    index : number

    @Basic()
    limit : number


}