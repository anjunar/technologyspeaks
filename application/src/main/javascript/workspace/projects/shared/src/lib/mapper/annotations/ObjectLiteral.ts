import 'reflect-metadata'
import {createProperty, AbstractPropertyDescriptor, StandardConfiguration, annotationMapping} from "../Registry";
import ManyToMany from "./ManyToMany";

function ObjectLiteral(configuration?: ObjectLiteral.Configuration) {
    return function (target: any, propertyKey: string) {
        const type = Reflect.getMetadata("design:type", target, propertyKey);

        createProperty(target, propertyKey, type, ObjectLiteral, configuration);
    }
}

namespace ObjectLiteral {
    export interface Configuration extends StandardConfiguration {

        type?: any

        default?: any

    }

    export class PropertyDescriptor extends AbstractPropertyDescriptor {

        override configuration : ObjectLiteral.Configuration

        constructor(name: string, configuration: ObjectLiteral.Configuration) {
            super(name);
            this.configuration = configuration;
        }
    }

}

export default ObjectLiteral

annotationMapping.set(ObjectLiteral, ObjectLiteral.PropertyDescriptor)
