import 'reflect-metadata'
import {createProperty, AbstractPropertyDescriptor, RelationConfiguration, annotationMapping} from "../Registry";

function Reference(configuration: Reference.Configuration) {
    return function (target: any, propertyKey: string) {
        const type = Reflect.getMetadata("design:type", target, propertyKey);

        createProperty(target, propertyKey, type, Reference, configuration);

    }
}

namespace Reference {
    export interface Configuration extends RelationConfiguration {

        signal?: boolean

        type?: any

    }

    export class PropertyDescriptor extends AbstractPropertyDescriptor {

        configuration: Reference.Configuration

        constructor(name: string, configuration: Reference.Configuration) {
            super(name);
            this.configuration = configuration;
        }
    }

}

export default Reference

annotationMapping.set(Reference, Reference.PropertyDescriptor)
