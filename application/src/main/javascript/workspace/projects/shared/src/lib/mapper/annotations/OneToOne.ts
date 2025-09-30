import 'reflect-metadata'
import {createProperty, AbstractPropertyDescriptor, RelationConfiguration, annotationMapping} from "../Registry";

function OneToOne(configuration: OneToOne.Configuration) {
    return function (target: any, propertyKey: string) {
        const type = Reflect.getMetadata("design:type", target, propertyKey);

        createProperty(target, propertyKey, type, OneToOne, configuration);

    }
}

namespace OneToOne {
    export interface Configuration extends RelationConfiguration {

        signal?: boolean

        type?: any

    }

    export class PropertyDescriptor extends AbstractPropertyDescriptor {

        configuration: OneToOne.Configuration

        constructor(name: string, configuration: OneToOne.Configuration) {
            super(name);
            this.configuration = configuration;
        }
    }

}

export default OneToOne

annotationMapping.set(OneToOne, OneToOne.PropertyDescriptor)
