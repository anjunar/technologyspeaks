import Entity from "../../mapper/annotations/Entity";
import Basic from "../../mapper/annotations/Basic";
import type LinkContainer from "./LinkContainer";
import ActiveObject from "./ActiveObject";
import Links from "./Links";
import OneToMany from "../../mapper/annotations/OneToMany";

@Entity("Table")
export default class Table<R> extends ActiveObject implements Links {

    override $type = "Table"

    @OneToMany({ targetEntity : null})
    rows : R[]

    @Basic()
    size : number

    @Basic()
    links : LinkContainer

}