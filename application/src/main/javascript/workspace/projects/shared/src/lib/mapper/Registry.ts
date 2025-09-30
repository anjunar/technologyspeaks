import Converter from "./converters/Converter";
import {Type} from "@angular/core";

const entityRegistry = new Set<Type<any>>();

const classRegistry = new Map<string, Type<any>>()

const converterRegistry = new Map<any, Converter<any, any>>()

export const annotationMapping = new Map<Function, Type<any>>()

export interface StandardConfiguration {
    signal?: boolean
    default?: any
}

export interface RelationConfiguration extends StandardConfiguration {
    targetEntity: Type<any>
}

export abstract class AbstractPropertyDescriptor {

    name: string

    abstract configuration: StandardConfiguration

    protected constructor(name: string) {
        this.name = name;
    }
}


export function createProperty(
    target: any,
    propertyKey: string,
    type: any,
    annotation: Function,
    configuration: any
) {
    const constructor = target.constructor

    if (!Object.prototype.hasOwnProperty.call(constructor, "properties")) {
        constructor.properties = {}
    }

    const properties = constructor.properties

    let property = properties[propertyKey]
    if (!property) {
        property = properties[propertyKey] = {
            annotations: new Map<Function, StandardConfiguration>()
        }
    }

    property.annotations.set(annotation, configuration)
    property.type = type

    return constructor
}

export function registerEntity(clazz: Type<any>) {
    entityRegistry.add(clazz)
}

export function registerClass(name: string, clazz: Type<any>) {
    classRegistry.set(name, clazz)
}

export function registerConverter(clazz: any, converter: Converter<any, any>) {
    converterRegistry.set(clazz, converter)
}

export function findClass(name: string) {
    return classRegistry.get(name)
}

export function findType(clazz: Type<any>): string {
    return Array.from(classRegistry.entries()).find(([key, value]) => value === clazz)[0]
}

export function findProperties(clazz: Function): AbstractPropertyDescriptor[] {

    if (clazz.name === "") {
        return []
    }

    let propertyDescriptors = Object.entries((clazz as any).properties || {}).flatMap(([key, value]: [key: string, value: any]) => {
        let annotations: Map<Function, any> = value.annotations;
        return Array.from(annotations.entries()).map(([annotation, configuration]) => {
            let descriptorType = annotationMapping.get(annotation);
            return new descriptorType(key, configuration)
        })
    })

    let prototypeOf = Object.getPrototypeOf(clazz);

    if (propertyDescriptors) {
        return propertyDescriptors.concat(findProperties(prototypeOf))
    } else {
        return findProperties(prototypeOf)
    }

}

export function findConverter(clazz: any) {
    return converterRegistry.get(clazz)
}

