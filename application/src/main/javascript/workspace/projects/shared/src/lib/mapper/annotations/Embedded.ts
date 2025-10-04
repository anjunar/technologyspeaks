import 'reflect-metadata'
import {createProperty, AbstractPropertyDescriptor, StandardConfiguration, annotationMapping} from "../Registry";

function Embedded(configuration?: Embedded.Configuration) {
    return function (target: any, propertyKey: string) {
        const type = Reflect.getMetadata("design:type", target, propertyKey);

        createProperty(target, propertyKey, type, Embedded, configuration);
    }
}

namespace Embedded {
    export interface Configuration extends StandardConfiguration {

        type?: any

        default?: any

    }

    export class PropertyDescriptor extends AbstractPropertyDescriptor {

        override configuration : Embedded.Configuration

        constructor(name: string, configuration: Embedded.Configuration) {
            super(name);
            this.configuration = configuration;
        }
    }

}

export default Embedded

annotationMapping.set(Embedded, Embedded.PropertyDescriptor)
