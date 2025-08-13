import NodeDescriptor from "./NodeDescriptor";
import Basic from "../../mapper/annotations/Basic";
import Entity from "../../mapper/annotations/Entity";

@Entity("EnumDescriptor")
export default class EnumDescriptor extends NodeDescriptor {

    $type = "EnumDescriptor"

    @Basic()
    enums : string[]


}