import {findClass, findConverter, findProperties} from "./Registry";
import {value} from "../meta-signal/value-signal";
import {match} from "../pattern-match";
import ManyToMany from "./annotations/ManyToMany";
import OneToOne from "./annotations/OneToOne";
import Basic from "./annotations/Basic";
import ManyToOne from "./annotations/ManyToOne";
import OneToMany from "./annotations/OneToMany";
import {Type} from "@angular/core";
import ObjectLiteral from "./annotations/ObjectLiteral";

function isPlainObject(obj: any): obj is Record<string, any> {
    if (obj === null || typeof obj !== 'object') return false;
    const proto = Object.getPrototypeOf(obj);
    return proto === Object.prototype || proto === null;
}

export default function JSONDeserializer<T>(object: any, Class : Type<any> = null): T {
    if (!(object instanceof Object)) {
        return object;
    }

    const type = object.$type;

    if (! Class) {
        Class = findClass(type);
    }

    if (!Class) {
        throw new Error("No Class registered for Type: " + type);
    }

    const instance = new Class();
    const properties = findProperties(Class);

    for (const property of properties) {

        const name = property.name;
        let element = object[name];

        if (element === undefined && property.configuration?.default !== undefined) {
            const def = property.configuration.default;
            element = typeof def === 'function' ? def() : def;
        }

        match(property)
            .withObject(Basic.PropertyDescriptor, property => {
                const converter = findConverter(property.configuration?.type);

                if (converter) {
                    const converterValue = converter.fromJson(element);
                    instance[name] = property.configuration?.signal ? value(converterValue) : converterValue;
                    return;
                }

                instance[name] = property.configuration?.signal ? value(element) : element;
            })
            .withObject(ObjectLiteral.PropertyDescriptor, property => {
                if (isPlainObject(element)) {
                    const mapped = Object.entries(element).reduce((prev, [key, value]) => {
                        prev[key] = JSONDeserializer(value, property.configuration.type);
                        return prev;
                    }, {} as any);
                    instance[name] = property.configuration?.signal ? value(mapped) : mapped;
                    return;
                }
            })
            .withObject(ManyToMany.PropertyDescriptor, property => {
                if (Array.isArray(element)) {
                    const mapped = element.map(item => JSONDeserializer(item, property.configuration.targetEntity));
                    instance[name] = property.configuration?.signal ? value(mapped) : mapped;
                }
            })
            .withObject(ManyToOne.PropertyDescriptor, property => {
                if (element && element.$type) {
                    const valueObject = JSONDeserializer(element, property.configuration.targetEntity);
                    instance[name] = property.configuration?.signal ? value(valueObject) : valueObject;
                }
            })
            .withObject(OneToMany.PropertyDescriptor, property => {
                if (Array.isArray(element)) {
                    const mapped = element.map(item => JSONDeserializer(item, property.configuration.targetEntity));
                    instance[name] = property.configuration?.signal ? value(mapped) : mapped;
                }
            })
            .withObject(OneToOne.PropertyDescriptor, property => {
                if (element && element.$type) {
                    const valueObject = JSONDeserializer(element, property.configuration.targetEntity);
                    instance[name] = property.configuration?.signal ? value(valueObject) : valueObject;
                }
            })

    }

    return instance;
}
