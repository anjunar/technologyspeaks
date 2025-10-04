import NodeDescriptor from "./NodeDescriptor";
import Entity from "../../mapper/annotations/Entity";
import Collection from "../../mapper/annotations/Collection";
import Embedded from "../../mapper/annotations/Embedded";

interface PropertiesContainer {
    [key: string]: NodeDescriptor
}

@Entity("ObjectDescriptor")
export default class ObjectDescriptor extends NodeDescriptor {

    override $type = "ObjectDescriptor"

    @Embedded({type: NodeDescriptor})
    properties: PropertiesContainer

    @Collection({targetEntity: ObjectDescriptor})
    oneOf: ObjectDescriptor[] = []

    allProperties(type: string): PropertiesContainer {
        let objectDescriptor = this.oneOf.find(one => one.type === type);
        return Object.assign({}, this.properties, objectDescriptor?.properties)
    }

}