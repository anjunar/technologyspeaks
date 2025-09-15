import Entity from "../../mapper/annotations/Entity";
import Basic from "../../mapper/annotations/Basic";
import type LinkContainer from "./LinkContainer";
import Links from "./Links";
import ActiveObject from "./ActiveObject";

@Entity("Row")
export default class Row<D> extends ActiveObject implements Links {

    override $type = "Row"

    @Basic()
    data: D

    @Basic()
    links: LinkContainer

}