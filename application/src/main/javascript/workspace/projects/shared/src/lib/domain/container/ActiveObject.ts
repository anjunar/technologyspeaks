import Basic from "../../mapper/annotations/Basic";
import LinkContainer from "./LinkContainer";
import ObjectDescriptor from "../descriptors/ObjectDescriptor";
import NodeDescriptor from "../descriptors/NodeDescriptor";
import PropertyDescriptor from "../descriptors/PropertyDescriptor";
import Link from "./Link";
import {Entity} from "../../mapper";
import {Signal} from "@angular/core";
import OneToOne from "../../mapper/annotations/OneToOne";

@Entity("Meta")
export class Meta {

    @OneToOne()
    descriptors : ObjectDescriptor

    @Basic()
    instance : PropertiesContainer

    @Basic()
    links : LinkContainer
}

export interface PropertiesContainer {
    [key: string]: PropertyDescriptor
}

export type Constructor<T> = new (...args: any[]) => T;

export default abstract class ActiveObject {

    @OneToOne()
    $meta : Meta

    @Basic()
    $type: string

    $instance : <E>(ctor : Constructor<E>) => E

}