import 'reflect-metadata'
import {annotationMapping, createProperty} from "../../Registry";

function Size(configuration: Size.Configuration) {
    return function (target: any, propertyKey: string) {
        const type = Reflect.getMetadata("design:type", target, propertyKey);

        createProperty(target, propertyKey, type, Size, configuration);
    }
}

namespace Size {
    export interface Configuration {

        min?: number

        max?: number

    }

    export class PropertyDescriptor {

        constructor(public name: string, public configuration: Size.Configuration) {}

    }

}

export default Size

annotationMapping.set(Size, Size.PropertyDescriptor)
