import 'reflect-metadata'
import {annotationMapping, createProperty} from "../Registry";

function UIField(configuration?: UIField.Configuration) {
    return function (target: any, propertyKey: string) {
        const type = Reflect.getMetadata("design:type", target, propertyKey);

        createProperty(target, propertyKey, type, UIField, configuration);
    }
}

namespace UIField {
    export interface Configuration {

        title: string

        widget: string

        link?: string

    }

    export class PropertyDescriptor {

        constructor(public name: string, public configuration: UIField.Configuration) {}

    }

}

export default UIField

annotationMapping.set(UIField, UIField.PropertyDescriptor)
