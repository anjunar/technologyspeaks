import Converter from "./converters/Converter";
import Basic from "./annotations/Basic";
import BasicConfiguration = Basic.Configuration;
import {Type} from "@angular/core";

const entityRegistry = new Set<Type<any>>();

const propertyRegistry = new Map<Function, PropertyDescriptor[]>()

const schemaPropertyRegistry = new Map<Function, PropertyDescriptor[]>()

const classRegistry = new Map<string, Type<any>>()

const converterRegistry = new Map<any, Converter<any, any>>()

export class PropertyDescriptor {

    name : string

    type : any

    configuration : BasicConfiguration

    constructor(name: string, type : any, configuration: BasicConfiguration) {
        this.name = name;
        this.type = type
        this.configuration = configuration;
    }
}

export function registerEntity(clazz : Type<any>) {
    entityRegistry.add(clazz)
}

export function registerProperty(clazz : Function, name : string, type : any, configuration : BasicConfiguration) {
    let element = propertyRegistry.get(clazz);
    if (element) {
        element.push(new PropertyDescriptor(name, type, configuration))
    } else {
        element = [new PropertyDescriptor(name, type, configuration)]
        propertyRegistry.set(clazz, element)
    }
    return element
}

export function registerSchemaProperty(clazz : Function, name : string, type : any, configuration : BasicConfiguration) {
    let element = schemaPropertyRegistry.get(clazz);
    if (element) {
        element.push(new PropertyDescriptor(name, type, configuration))
    } else {
        element = [new PropertyDescriptor(name, type, configuration)]
        schemaPropertyRegistry.set(clazz, element)
    }
    return element
}


export function registerClass(name : string, clazz : Type<any>) {
    classRegistry.set(name, clazz)
}

export function registerConverter(clazz : any, converter : Converter<any, any>) {
    converterRegistry.set(clazz, converter)
}

export function findClass(name : string) {
    return classRegistry.get(name)
}

export function findType(clazz : Type<any>) : string {
    return Array.from(classRegistry.entries()).find(([key, value]) => value === clazz)[0]
}

export function findProperties(clazz : Function) : PropertyDescriptor[] {

    let propertyDescriptors = propertyRegistry.get(clazz);

    if (clazz.name === "") {
        return []
    }

    let prototypeOf = Object.getPrototypeOf(clazz);

    if (propertyDescriptors) {
        return propertyDescriptors.concat(findProperties(prototypeOf))
    } else {
        return findProperties(prototypeOf)
    }

    return []

}

export function findSchemaProperties(clazz : Function) : PropertyDescriptor[] {

    let propertyDescriptors = schemaPropertyRegistry.get(clazz);

    if (clazz.name === "") {
        return []
    }

    let prototypeOf = Object.getPrototypeOf(clazz);

    if (propertyDescriptors) {
        return propertyDescriptors.concat(findSchemaProperties(prototypeOf))
    } else {
        return findSchemaProperties(prototypeOf)
    }

    return []

}

export function findConverter(clazz : any) {
    return converterRegistry.get(clazz)
}

