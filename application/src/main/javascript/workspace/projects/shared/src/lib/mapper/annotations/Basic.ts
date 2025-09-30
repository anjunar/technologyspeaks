import 'reflect-metadata'
import {createProperty, AbstractPropertyDescriptor, StandardConfiguration, annotationMapping} from "../Registry";
import ManyToMany from "./ManyToMany";

function Basic(configuration?: Basic.Configuration) {
    return function (target: any, propertyKey: string) {
        const type = Reflect.getMetadata("design:type", target, propertyKey);

        createProperty(target, propertyKey, type, Basic, configuration);
    }
}

namespace Basic {
    export interface Configuration extends StandardConfiguration {

        type?: any

        default?: any

    }

    export class PropertyDescriptor extends AbstractPropertyDescriptor {

        override configuration : Basic.Configuration

        constructor(name: string, configuration: Basic.Configuration) {
            super(name);
            this.configuration = configuration;
        }
    }

}

export default Basic

annotationMapping.set(Basic, Basic.PropertyDescriptor)
