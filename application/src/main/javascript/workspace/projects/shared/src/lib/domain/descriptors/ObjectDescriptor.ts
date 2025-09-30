import NodeDescriptor from "./NodeDescriptor";
import Basic from "../../mapper/annotations/Basic";
import Entity from "../../mapper/annotations/Entity";
import ManyToOne from "../../mapper/annotations/ManyToOne";

interface PropertiesContainer {
    [key: string]: NodeDescriptor
}

@Entity("ObjectDescriptor")
export default class ObjectDescriptor extends NodeDescriptor {

    override $type = "ObjectDescriptor"

    @Basic()
    properties: PropertiesContainer

    @ManyToOne({targetEntity : ObjectDescriptor})
    oneOf: ObjectDescriptor[] = []

    allProperties(type: string): PropertiesContainer {
        let objectDescriptor = this.oneOf.find(one => one.type === type);
        return Object.assign({}, this.properties, objectDescriptor?.properties)
    }

}