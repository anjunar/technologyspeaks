import {
    findConverter, findProperties
} from "./Registry";
import {match} from "../pattern-match";
import ManyToMany from "./annotations/ManyToMany";
import OneToOne from "./annotations/OneToOne";
import Basic from "./annotations/Basic";
import ManyToOne from "./annotations/ManyToOne";
import OneToMany from "./annotations/OneToMany";

function isPlainObject(obj: any): obj is Record<string, any> {
    if (obj === null || typeof obj !== 'object') return false;
    const proto = Object.getPrototypeOf(obj);
    return proto === Object.prototype || proto === null;
}

export default function JSONSerializer(entity: any): any {
    if (Array.isArray(entity)) {
        return entity.map(item => JSONSerializer(item));
    }

    if (!(entity instanceof Object)) {
        return entity;
    }

    const converter = findConverter(entity.constructor);
    if (converter) {
        return converter.toJson(entity);
    }

    const properties = findProperties(entity.constructor);

    return properties
        .filter(prop => !prop.name.startsWith("$") || prop.name === "$type")
        .reduce((prev, prop) => {
            let value = entity[prop.name];

            if (typeof value === "function") {
                value = value();
            }

            if (value === null || value === undefined) {
                return prev;
            }

            match(prop)
                .withObject(Basic.PropertyDescriptor, prop => {

                    const propConverter = findConverter(prop.configuration?.type);
                    if (propConverter) {
                        prev[prop.name] = propConverter.toJson(value);
                        return prev;
                    }

                    if (isPlainObject(value)) {
                        prev[prop.name] = Object.entries(value).reduce((acc, [k, v]) => {
                            acc[k] = JSONSerializer(v);
                            return acc;
                        }, {} as any);
                        return prev;
                    }

                    prev[prop.name] = value;
                })
                .withObject(ManyToMany.PropertyDescriptor, prop => {
                    if (Array.isArray(value)) {
                        prev[prop.name] = value.map(item => JSONSerializer(item));
                        return prev;
                    }
                })
                .withObject(ManyToOne.PropertyDescriptor, prop => {
                    if (value.$type) {
                        prev[prop.name] = JSONSerializer(value);
                        return prev;
                    }
                })
                .withObject(OneToMany.PropertyDescriptor, prop => {
                    if (Array.isArray(value)) {
                        prev[prop.name] = value.map(item => JSONSerializer(item));
                        return prev;
                    }
                })
                .withObject(OneToOne.PropertyDescriptor, prop => {
                    if (value.$type) {
                        prev[prop.name] = JSONSerializer(value);
                        return prev;
                    }
                })



            return prev;
        }, {} as any);
}
