import 'reflect-metadata'
import {annotationMapping, createProperty} from "../../Registry";

function Email(configuration?: Email.Configuration) {
    return function (target: any, propertyKey: string) {
        const type = Reflect.getMetadata("design:type", target, propertyKey);

        createProperty(target, propertyKey, type, Email, configuration);
    }
}

namespace Email {
    export interface Configuration {}

    export class PropertyDescriptor {

        constructor(public name: string, public configuration: Email.Configuration) {}

    }

}

export default Email

annotationMapping.set(Email, Email.PropertyDescriptor)
