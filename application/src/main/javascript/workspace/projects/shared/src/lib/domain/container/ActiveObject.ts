import Basic from "../../mapper/annotations/Basic";
import LinkContainer from "./LinkContainer";
import ObjectDescriptor from "../descriptors/ObjectDescriptor";
import NodeDescriptor from "../descriptors/NodeDescriptor";
import PropDescriptor from "../descriptors/PropDescriptor";
import Link from "./Link";

interface PropertiesContainer {
    [key: string]: PropDescriptor
}

export default abstract class ActiveObject {

    $data?: any

    @Basic()
    $links? : LinkContainer

    @Basic()
    $type: string

    $resolve : any

    $meta?(value: string): NodeDescriptor

    $callbacks? : ((property : string, value : any) => void)[]

    @Basic()
    $descriptors : ObjectDescriptor

    @Basic()
    $instance : PropertiesContainer

}