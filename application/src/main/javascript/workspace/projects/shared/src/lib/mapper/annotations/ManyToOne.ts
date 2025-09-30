import 'reflect-metadata'
import {createProperty, AbstractPropertyDescriptor, RelationConfiguration, annotationMapping} from "../Registry";
import OneToMany from "./OneToMany";

function ManyToOne(configuration?: ManyToOne.Configuration) {
    return function (target: any, propertyKey: string) {
        const type = Reflect.getMetadata("design:type", target, propertyKey);

        createProperty(target, propertyKey, type, ManyToOne, configuration);
    }
}

namespace ManyToOne {
    export interface Configuration extends RelationConfiguration {

        default?: any

        signal?: boolean

        type?: any

    }

    export class PropertyDescriptor extends AbstractPropertyDescriptor {

        configuration: ManyToOne.Configuration

        constructor(name: string, configuration: ManyToOne.Configuration) {
            super(name);
            this.configuration = configuration;
        }
    }

}

export default ManyToOne

annotationMapping.set(ManyToOne, ManyToOne.PropertyDescriptor)
