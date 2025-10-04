import Primitive from "../../mapper/annotations/Primitive";
import LinkContainer from "./LinkContainer";
import ObjectDescriptor from "../descriptors/ObjectDescriptor";
import NodeDescriptor from "../descriptors/NodeDescriptor";
import PropertyDescriptor from "../descriptors/PropertyDescriptor";
import Link from "./Link";
import {Entity, findType, Mapper} from "../../mapper";
import {Signal} from "@angular/core";
import Reference from "../../mapper/annotations/Reference";
import Embedded from "../../mapper/annotations/Embedded";

@Entity("Meta")
export class Meta {

    @Reference({targetEntity : ObjectDescriptor})
    descriptors : ObjectDescriptor

    @Primitive()
    instance : PropertiesContainer

    @Primitive()
    links : LinkContainer
}

export interface PropertiesContainer {
    [key: string]: PropertyDescriptor
}

export type Constructor<T> = new (...args: any[]) => T;

export default abstract class ActiveObject {

    @Embedded({type : PropertyDescriptor})
    $descriptors : PropertiesContainer

    @Embedded({type : Link})
    $links : LinkContainer

    @Primitive()
    $type: string

    static newInstance<T extends ActiveObject>(this: new () => T): T {
        return Mapper.domain({ $type : findType(this)});
    }

    static fromJSON<T extends ActiveObject>(this: new () => T, json : any): T {
        return Mapper.domain(json, this);
    }

    static toJSON<T extends ActiveObject>(this: new () => T, json : any): any {
        return Mapper.toJson(json);
    }


}