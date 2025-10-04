import 'reflect-metadata'
import {createProperty, AbstractPropertyDescriptor, RelationConfiguration, annotationMapping} from "../Registry";

function Collection(configuration: Collection.Configuration) {
    return function (target: any, propertyKey: string) {
        const type = Reflect.getMetadata("design:type", target, propertyKey);

        createProperty(target, propertyKey, type, Collection, configuration);

    }
}

namespace Collection {
    export interface Configuration extends RelationConfiguration {

        signal?: boolean

        type?: any

    }

    export class PropertyDescriptor extends AbstractPropertyDescriptor {

        configuration: Collection.Configuration

        constructor(name: string, configuration: Collection.Configuration) {
            super(name);
            this.configuration = configuration;
        }
    }

}

export default Collection

annotationMapping.set(Collection, Collection.PropertyDescriptor)
