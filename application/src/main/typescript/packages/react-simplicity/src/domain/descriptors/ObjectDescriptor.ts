import NodeDescriptor from "./NodeDescriptor";
import Basic from "../../mapper/annotations/Basic";
import Entity from "../../mapper/annotations/Entity";

interface PropertiesContainer {
    [key: string]: NodeDescriptor
}

@Entity("ObjectDescriptor")
export default class ObjectDescriptor extends NodeDescriptor {

    $type = "ObjectDescriptor"

    @Basic()
    properties: PropertiesContainer

    @Basic()
    oneOf : ObjectDescriptor[] = []

    allProperties(type : string) : PropertiesContainer {
        let objectDescriptor = this.oneOf.find(one => one.type === type);
        return Object.assign({}, this.properties, objectDescriptor?.properties)
    }

}