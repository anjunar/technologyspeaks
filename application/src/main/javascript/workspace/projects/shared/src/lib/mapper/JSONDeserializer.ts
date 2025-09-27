import {findClass, findConverter, findProperties} from "./Registry";
import {value} from "../meta-signal/value-signal";

function isPlainObject(obj: any): obj is Record<string, any> {
    if (obj === null || typeof obj !== 'object') return false;
    const proto = Object.getPrototypeOf(obj);
    return proto === Object.prototype || proto === null;
}

export default function JSONDeserializer<T>(object: any, buildObjectGraph = false): T {
    if (!(object instanceof Object)) {
        return object;
    }

    const type = object.$type;
    const Class: any = findClass(type);

    if (!Class) {
        throw new Error("No Class registered for Type: " + type);
    }

    const instance = new Class();
    const properties = findProperties(Class);

    for (const property of properties) {
        const name = property.name;
        const converter = findConverter(property.type);
        let element = object[name];

        if (element === undefined && property.configuration?.default !== undefined) {
            const def = property.configuration.default;
            element = typeof def === 'function' ? def() : def;
        }

        if (Array.isArray(element)) {
            const mapped = element.map(item => JSONDeserializer(item, buildObjectGraph));
            instance[name] = property.configuration?.signal ? value(mapped) : mapped;
            continue;
        }

        if (converter) {
            const converterValue = converter.fromJson(element);
            instance[name] = property.configuration?.signal ? value(converterValue) : converterValue;
            continue;
        }

        if (element && element.$type) {
            const valueObject = JSONDeserializer(element, buildObjectGraph);
            instance[name] = property.configuration?.signal ? value(valueObject) : valueObject;
            continue;
        }

        if (isPlainObject(element)) {
            const mapped = Object.entries(element).reduce((prev, [key, value]) => {
                prev[key] = JSONDeserializer(value, buildObjectGraph);
                return prev;
            }, {} as any);
            instance[name] = property.configuration?.signal ? value(mapped) : mapped;
            continue;
        }

        instance[name] = property.configuration?.signal ? value(element) : element;
    }

    return instance;
}
