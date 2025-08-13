import Basic from "../../mapper/annotations/Basic";
import LinkContainerObject from "./LinkContainerObject";
import ObjectDescriptor from "../descriptors/ObjectDescriptor";
import NodeDescriptor from "../descriptors/NodeDescriptor";

export default abstract class ActiveObject {

    $data?: any

    @Basic()
    $links? : LinkContainerObject

    @Basic()
    $type: string

    $resolve : any

    $meta?(value: string): NodeDescriptor

    $callbacks? : ((property : string, value : any) => void)[]

    @Basic()
    $descriptors : ObjectDescriptor

}