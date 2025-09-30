import 'reflect-metadata'
import {annotationMapping, createProperty} from "../../Registry";

function NotNull(configuration?: NotNull.Configuration) {
    return function (target: any, propertyKey: string) {
        const type = Reflect.getMetadata("design:type", target, propertyKey);

        createProperty(target, propertyKey, type, NotNull, configuration);
    }
}

namespace NotNull {
    export interface Configuration {}

    export class PropertyDescriptor {

        constructor(public name: string, public configuration: NotNull.Configuration) {}

    }

}

export default NotNull

annotationMapping.set(NotNull, NotNull.PropertyDescriptor)
