import Basic from "../../mapper/annotations/Basic";
import LinkContainer from "./LinkContainer";
import ObjectDescriptor from "../descriptors/ObjectDescriptor";
import NodeDescriptor from "../descriptors/NodeDescriptor";
import PropDescriptor from "../descriptors/PropDescriptor";
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
    [key: string]: PropDescriptor
}

export default abstract class ActiveObject {

    @Basic()
    $meta : Meta

    @Basic()
    $type: string

    $resolve : any

    $callbacks? : ((property : string, value : any) => void)[]

}