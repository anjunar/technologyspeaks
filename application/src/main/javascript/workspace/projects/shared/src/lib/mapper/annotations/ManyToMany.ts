import 'reflect-metadata'
import {AbstractPropertyDescriptor, annotationMapping, createProperty, RelationConfiguration} from "../Registry";

function ManyToMany(configuration: ManyToMany.Configuration) {
    return function (target: any, propertyKey: string) {
        const type = Reflect.getMetadata("design:type", target, propertyKey);

        createProperty(target, propertyKey, type, ManyToMany, configuration);

    }
}

namespace ManyToMany {
    export interface Configuration extends RelationConfiguration {

        default?: any

        signal?: boolean

        type?: any

    }

    export class PropertyDescriptor extends AbstractPropertyDescriptor {

        configuration: ManyToMany.Configuration

        constructor(name: string, configuration: ManyToMany.Configuration) {
            super(name);
            this.configuration = configuration;
        }
    }

}

export default ManyToMany

annotationMapping.set(ManyToMany, ManyToMany.PropertyDescriptor)
