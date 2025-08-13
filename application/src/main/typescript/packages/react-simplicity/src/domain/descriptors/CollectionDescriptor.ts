import NodeDescriptor from "./NodeDescriptor";
import Basic from "../../mapper/annotations/Basic";
import Entity from "../../mapper/annotations/Entity";
import ObjectDescriptor from "./ObjectDescriptor";

@Entity("CollectionDescriptor")
export default class CollectionDescriptor extends NodeDescriptor    {

    $type = "CollectionDescriptor"

    @Basic()
    items : ObjectDescriptor

}