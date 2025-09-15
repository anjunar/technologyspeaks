import Entity from "../../mapper/annotations/Entity";
import Basic from "../../mapper/annotations/Basic";
import type LinkContainer from "./LinkContainer";
import ActiveObject from "./ActiveObject";
import Links from "./Links";

@Entity("TupleTable")
export default class TupleTable<R> extends ActiveObject implements Links {

    override $type = "TupleTable"

    @Basic()
    rows : R[]

    @Basic()
    size : number

    @Basic()
    links : LinkContainer

}