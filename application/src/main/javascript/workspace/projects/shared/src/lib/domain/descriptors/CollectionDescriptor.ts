import NodeDescriptor from "./NodeDescriptor";
import Entity from "../../mapper/annotations/Entity";
import ObjectDescriptor from "./ObjectDescriptor";
import ManyToOne from "../../mapper/annotations/ManyToOne";

@Entity("CollectionDescriptor")
export default class CollectionDescriptor extends NodeDescriptor {

    override $type = "CollectionDescriptor"

    @ManyToOne()
    items: ObjectDescriptor

}