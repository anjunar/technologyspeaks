import Entity from "../../mapper/annotations/Entity";
import Primitive from "../../mapper/annotations/Primitive";
import type LinkContainer from "./LinkContainer";
import ActiveObject from "./ActiveObject";
import Links from "./Links";
import Collection from "../../mapper/annotations/Collection";

@Entity("Table")
export default class Table<R> extends ActiveObject implements Links {

    override $type = "Table"

    @Collection({ targetEntity : null})
    rows : R[]

    @Primitive()
    size : number

    @Primitive()
    links : LinkContainer

}