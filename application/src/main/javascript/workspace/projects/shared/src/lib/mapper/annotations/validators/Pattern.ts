import 'reflect-metadata'
import {annotationMapping, createProperty} from "../../Registry";

function Pattern(configuration: Pattern.Configuration) {
    return function (target: any, propertyKey: string) {
        const type = Reflect.getMetadata("design:type", target, propertyKey);

        createProperty(target, propertyKey, type, Pattern, configuration);
    }
}

namespace Pattern {
    export interface Configuration {

        regex: string

    }

    export class PropertyDescriptor {

        constructor(public name: string, public configuration: Pattern.Configuration) {}

    }

}

export default Pattern

annotationMapping.set(Pattern, Pattern.PropertyDescriptor)
