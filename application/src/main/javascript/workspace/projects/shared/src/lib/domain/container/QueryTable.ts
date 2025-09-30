import Entity from "../../mapper/annotations/Entity";
import Basic from "../../mapper/annotations/Basic";
import type LinkContainer from "./LinkContainer";
import ActiveObject from "./ActiveObject";
import Links from "./Links";
import OneToMany from "../../mapper/annotations/OneToMany";

@Entity("QueryTable")
export default class QueryTable<S, R> extends ActiveObject implements Links {

    override $type = "QueryTable"

    @OneToMany()
    rows : R[]

    @Basic()
    size : number

    @Basic()
    links : LinkContainer

    @Basic()
    search : S

}