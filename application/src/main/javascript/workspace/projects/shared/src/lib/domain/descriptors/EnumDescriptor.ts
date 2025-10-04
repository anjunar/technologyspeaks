import NodeDescriptor from "./NodeDescriptor";
import Primitive from "../../mapper/annotations/Primitive";
import Entity from "../../mapper/annotations/Entity";

@Entity("EnumDescriptor")
export default class EnumDescriptor extends NodeDescriptor {

    override $type = "EnumDescriptor"

    @Primitive()
    enums : string[]


}