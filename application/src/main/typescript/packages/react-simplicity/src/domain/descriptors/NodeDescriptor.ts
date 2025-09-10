import Basic from "../../mapper/annotations/Basic";
import type LinkContainerObject from "../container/LinkContainerObject";
import MappedSuperclass from "../../mapper/annotations/MappedSuperclass";
import ValidatorContainer from "./validators/ValidatorContainer";

@MappedSuperclass("NodeDescriptor")
export default class NodeDescriptor {

    $type = "NodeDescriptor"

    @Basic()
    type : string

    @Basic()
    title : string

    @Basic()
    description? : string

    @Basic()
    widget : string

    @Basic()
    name? : boolean

    @Basic()
    id? : boolean

    @Basic()
    hidden? : boolean

    @Basic()
    step? : string

    @Basic()
    links? : LinkContainerObject

    @Basic()
    validators? : ValidatorContainer

}