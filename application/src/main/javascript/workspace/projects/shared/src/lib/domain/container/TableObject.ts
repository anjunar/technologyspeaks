import Entity from "../../mapper/annotations/Entity";
import Basic from "../../mapper/annotations/Basic";
import type LinkContainerObject from "./LinkContainerObject";
import ActiveObject from "./ActiveObject";
import LinksObject from "./LinksObject";

@Entity("Table")
export default class TableObject<R> extends ActiveObject implements LinksObject {

    override $type = "Table"

    @Basic()
    rows : R[]

    @Basic()
    size : number

    @Basic()
    links : LinkContainerObject

}