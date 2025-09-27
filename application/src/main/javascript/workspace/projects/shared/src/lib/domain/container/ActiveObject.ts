import Basic from "../../mapper/annotations/Basic";
import LinkContainer from "./LinkContainer";
import ObjectDescriptor from "../descriptors/ObjectDescriptor";
import NodeDescriptor from "../descriptors/NodeDescriptor";
import PropertyDescriptor from "../descriptors/PropertyDescriptor";
import Link from "./Link";
import {Entity} from "../../mapper";
import {Signal} from "@angular/core";

@Entity("Meta")
export class Meta {

    @Basic()
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

    @Basic()
    $meta : Meta

    @Basic()
    $type: string

    $instance : <E>(ctor : Constructor<E>) => E

}