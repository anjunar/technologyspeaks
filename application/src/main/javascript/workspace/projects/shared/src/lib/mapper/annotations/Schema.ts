import 'reflect-metadata'
import {annotationMapping, createProperty} from "../Registry";

function Schema(configuration?: Schema.Configuration) {
    return function (target: any, propertyKey: string) {
        const type = Reflect.getMetadata("design:type", target, propertyKey);

        createProperty(target, propertyKey, type, Schema, configuration);
    }
}

namespace Schema {
    export interface Configuration {

        title?: string

        widget?: string

        link?: string

    }

    export class PropertyDescriptor {

        constructor(public name: string, public configuration: Schema.Configuration) {}

    }

}

export default Schema

annotationMapping.set(Schema, Schema.PropertyDescriptor)
