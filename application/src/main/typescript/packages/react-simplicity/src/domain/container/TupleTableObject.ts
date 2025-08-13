import Entity from "../../mapper/annotations/Entity";
import Basic from "../../mapper/annotations/Basic";
import type LinkContainerObject from "./LinkContainerObject";
import ActiveObject from "./ActiveObject";
import LinksObject from "./LinksObject";

@Entity("TupleTable")
export default class TupleTableObject<R> extends ActiveObject implements LinksObject {

    $type = "TupleTable"

    @Basic()
    rows : R[]

    @Basic()
    size : number

    @Basic()
    links : LinkContainerObject

}