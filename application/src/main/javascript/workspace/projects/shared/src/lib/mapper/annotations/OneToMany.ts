import 'reflect-metadata'
import {createProperty, AbstractPropertyDescriptor, RelationConfiguration, annotationMapping} from "../Registry";

function OneToMany(configuration: OneToMany.Configuration) {
    return function (target: any, propertyKey: string) {
        const type = Reflect.getMetadata("design:type", target, propertyKey);

        createProperty(target, propertyKey, type, OneToMany, configuration);

    }
}

namespace OneToMany {
    export interface Configuration extends RelationConfiguration {

        default?: any

        signal?: boolean

        type?: any

    }

    export class PropertyDescriptor extends AbstractPropertyDescriptor {

        configuration: OneToMany.Configuration

        constructor(name: string, configuration: OneToMany.Configuration) {
            super(name);
            this.configuration = configuration;
        }
    }

}

export default OneToMany

annotationMapping.set(OneToMany, OneToMany.PropertyDescriptor)
