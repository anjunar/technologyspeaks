import Basic from "../../mapper/annotations/Basic";
import LinkContainer from "./LinkContainer";
import ObjectDescriptor from "../descriptors/ObjectDescriptor";
import NodeDescriptor from "../descriptors/NodeDescriptor";
import PropertyDescriptor from "../descriptors/PropertyDescriptor";
import Link from "./Link";
import {Entity, Mapper} from "../../mapper";
import {Signal} from "@angular/core";
import OneToOne from "../../mapper/annotations/OneToOne";
import ObjectLiteral from "../../mapper/annotations/ObjectLiteral";

@Entity("Meta")
export class Meta {

    @OneToOne({targetEntity : ObjectDescriptor})
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

    @ObjectLiteral({type : PropertyDescriptor})
    $descriptors : PropertiesContainer

    @Basic()
    $links : LinkContainer

    @Basic()
    $type: string

    static newInstance<T extends ActiveObject>(this: new () => T): T {
        return Mapper.domain({ $type : new this().$type});
    }

}