import Entity from "../../mapper/annotations/Entity";
import Primitive from "../../mapper/annotations/Primitive";
import type LinkContainer from "./LinkContainer";
import Links from "./Links";
import ActiveObject from "./ActiveObject";

@Entity("Row")
export default class Row<D> extends ActiveObject implements Links {

    override $type = "Row"

    @Primitive()
    data: D

    @Primitive()
    links: LinkContainer

}