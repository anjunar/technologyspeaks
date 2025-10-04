import {findClass, findConverter, findProperties} from "./Registry";
import {value} from "../meta-signal/value-signal";
import {match} from "../pattern-match";
import Reference from "./annotations/Reference";
import Primitive from "./annotations/Primitive";
import Collection from "./annotations/Collection";
import {Type} from "@angular/core";
import Embedded from "./annotations/Embedded";

function isPlainObject(obj: any): obj is Record<string, any> {
    if (obj === null || typeof obj !== 'object') return false;
    const proto = Object.getPrototypeOf(obj);
    return proto === Object.prototype || proto === null;
}

export default function JSONDeserializer<T>(object: any, Class: Type<any> = null): T {

    if (typeof object === "undefined") {
        throw new Error("Object is undefined")
    }

    if (!(object instanceof Object)) {
        return object;
    }

    const type = object.$type;

    if (!Class) {
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
            .withObject(Primitive.PropertyDescriptor, property => {
                const converter = findConverter(property.configuration?.type);

                if (converter) {
                    const converterValue = converter.fromJson(element);
                    instance[name] = property.configuration?.signal ? value(converterValue) : converterValue;
                    return;
                }

                instance[name] = property.configuration?.signal ? value(element) : element;
            })
            .withObject(Embedded.PropertyDescriptor, property => {
                if (isPlainObject(element)) {
                    const mapped = Object.entries(element).reduce((prev, [key, value]) => {
                        prev[key] = JSONDeserializer(value, property.configuration.type);
                        return prev;
                    }, {} as any);
                    instance[name] = property.configuration?.signal ? value(mapped) : mapped;
                    return;
                }
            })
            .withObject(Collection.PropertyDescriptor, property => {
                if (Array.isArray(element)) {
                    const mapped = element.map(item => JSONDeserializer(item, property.configuration.targetEntity));
                    instance[name] = property.configuration?.signal ? value(mapped) : mapped;
                }
            })
            .withObject(Reference.PropertyDescriptor, property => {
                const valueObject = element ? JSONDeserializer(element, property.configuration.targetEntity) : undefined;
                instance[name] = property.configuration?.signal ? value(valueObject) : valueObject;
            })

    }

    return instance;
}
