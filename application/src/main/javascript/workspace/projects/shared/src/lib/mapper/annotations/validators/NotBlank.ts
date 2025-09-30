import 'reflect-metadata'
import {annotationMapping, createProperty} from "../../Registry";

function NotBlank(configuration?: NotBlank.Configuration) {
    return function (target: any, propertyKey: string) {
        const type = Reflect.getMetadata("design:type", target, propertyKey);

        createProperty(target, propertyKey, type, NotBlank, configuration);
    }
}

namespace NotBlank {
    export interface Configuration {}

    export class PropertyDescriptor {

        constructor(public name: string, public configuration: NotBlank.Configuration) {}

    }

}

export default NotBlank

annotationMapping.set(NotBlank, NotBlank.PropertyDescriptor)
