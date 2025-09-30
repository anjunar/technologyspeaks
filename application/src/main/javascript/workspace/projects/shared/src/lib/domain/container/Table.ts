import Entity from "../../mapper/annotations/Entity";
import Basic from "../../mapper/annotations/Basic";
import type LinkContainer from "./LinkContainer";
import ActiveObject from "./ActiveObject";
import Links from "./Links";
import OneToMany from "../../mapper/annotations/OneToMany";
import { getRowType } from "../../mapper/annotations/RowType";

@Entity("Table")
export default class Table<R> extends ActiveObject implements Links {

    override $type = "Table"

    @OneToMany({ targetEntity : () => Table.getRowType(this) })
    rows : R[]

    @Basic()
    size : number

    @Basic()
    links : LinkContainer

    private static getRowType(instance: any) {
        return getRowType(instance.constructor);
    }

}