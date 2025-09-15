import Entity from "../../mapper/annotations/Entity";
import Basic from "../../mapper/annotations/Basic";
import type LinkContainer from "./LinkContainer";
import ActiveObject from "./ActiveObject";
import Links from "./Links";

@Entity("Table")
export default class Table<R> extends ActiveObject implements Links {

    override $type = "Table"

    @Basic()
    rows : R[]

    @Basic()
    size : number

    @Basic()
    links : LinkContainer

}