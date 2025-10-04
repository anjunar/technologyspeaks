import NodeDescriptor from "./NodeDescriptor";
import Entity from "../../mapper/annotations/Entity";
import ObjectDescriptor from "./ObjectDescriptor";
import Reference from "../../mapper/annotations/Reference";

@Entity("CollectionDescriptor")
export default class CollectionDescriptor extends NodeDescriptor {

    override $type = "CollectionDescriptor"

    @Reference({targetEntity: ObjectDescriptor})
    items: ObjectDescriptor

}