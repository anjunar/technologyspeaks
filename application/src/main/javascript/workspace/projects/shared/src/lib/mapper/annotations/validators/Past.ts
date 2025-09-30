import 'reflect-metadata'
import {annotationMapping, createProperty} from "../../Registry";

function Past(configuration?: Past.Configuration) {
    return function (target: any, propertyKey: string) {
        const type = Reflect.getMetadata("design:type", target, propertyKey);

        createProperty(target, propertyKey, type, Past, configuration);
    }
}

namespace Past {
    export interface Configuration {}

    export class PropertyDescriptor {

        constructor(public name: string, public configuration: Past.Configuration) {}

    }

}

export default Past

annotationMapping.set(Past, Past.PropertyDescriptor)
