import Primitive from "../../mapper/annotations/Primitive";
import type LinkContainer from "../container/LinkContainer";
import ValidatorContainer from "./validators/ValidatorContainer";

export default class NodeDescriptor {

    $type = "NodeDescriptor"

    @Primitive()
    type: string

    @Primitive()
    title: string

    @Primitive()
    description?: string

    @Primitive()
    widget: string

    @Primitive()
    name?: boolean

    @Primitive()
    id?: boolean

    @Primitive()
    hidden?: boolean

    @Primitive()
    step?: string

    @Primitive()
    links?: LinkContainer

    @Primitive()
    validators?: ValidatorContainer

}