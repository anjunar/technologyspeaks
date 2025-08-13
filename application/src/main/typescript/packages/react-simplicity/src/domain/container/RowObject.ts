import Entity from "../../mapper/annotations/Entity";
import Basic from "../../mapper/annotations/Basic";
import type LinkContainerObject from "./LinkContainerObject";
import LinksObject from "./LinksObject";
import ActiveObject from "./ActiveObject";

@Entity("Row")
export default class RowObject<D> extends ActiveObject implements LinksObject {

    $type = "Row"

    @Basic()
    data: D

    @Basic()
    links: LinkContainerObject

}