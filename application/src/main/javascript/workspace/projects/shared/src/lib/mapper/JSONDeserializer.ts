import {findClass, findConverter, findProperties} from "./Registry";
import ActiveObject from "../domain/container/ActiveObject";
import JSONSerializer from "./JSONSerializer";
import {signal} from "@angular/core";

export default function JSONDeserializer<T>(object: any, buildObjectGraph : boolean = false): T {
    if (object instanceof Object) {
        let type = object.$type

        let Class: any = findClass(type);

        if (!Class) {
            throw new Error("No Class registered for Type: " + type)
        }

        let instance = new Class()

        let properties = findProperties(Class);

        for (const property of properties) {
            let name = property.name;

            let converter = findConverter(property.type);

            let element = object[name]

            if (element === undefined) {
                if (property.configuration?.default) {
                    let entity = new property.configuration.default()
                    if (entity instanceof ActiveObject) {
                        if (buildObjectGraph) {
                            element = object[name] = JSONSerializer(entity)
                        }
                    } else {
                        element = object[name] = entity
                    }
                }
            }
            if (element instanceof Array) {
                if (property.configuration?.signal) {
                    instance[name] = signal(element.map(item => JSONDeserializer(item, buildObjectGraph)))
                } else {
                    instance[name] = element.map(item => JSONDeserializer(item, buildObjectGraph))
                }
            } else {
                if (element instanceof Object) {
                    if (converter) {
                        if (property.configuration?.signal) {
                            instance[name] = signal(converter.fromJson(element))
                        } else {
                            instance[name] = converter.fromJson(element)
                        }
                    } else {
                        if (element.$type) {
                            if (property.configuration?.signal) {
                                instance[name] = signal(JSONDeserializer(object[name], buildObjectGraph))
                            } else {
                                instance[name] = JSONDeserializer(object[name], buildObjectGraph)
                            }
                        } else {
                            if (property.configuration?.signal) {
                                instance[name] = signal(Object.entries(element)
                                    .reduce((prev, [key, value]) => {
                                        if (value instanceof Array) {
                                            prev[key] = value.map(item => JSONDeserializer(item, buildObjectGraph))
                                            return prev
                                        } else {
                                            prev[key] = JSONDeserializer(value, buildObjectGraph)
                                            return prev
                                        }
                                    }, {} as any))
                            } else {
                                instance[name] = Object.entries(element)
                                    .reduce((prev, [key, value]) => {
                                        if (value instanceof Array) {
                                            prev[key] = value.map(item => JSONDeserializer(item, buildObjectGraph))
                                            return prev
                                        } else {
                                            prev[key] = JSONDeserializer(value, buildObjectGraph)
                                            return prev
                                        }
                                    }, {} as any)
                            }

                        }
                    }
                } else {
                    let converter = findConverter(property.type);
                    if (converter) {
                        if (property.configuration?.signal) {
                            instance[name] = signal(converter.fromJson(object[name]))
                        } else {
                            instance[name] = converter.fromJson(object[name])
                        }
                    } else {
                        if (element !== undefined) {
                            if (property.configuration?.signal) {
                                instance[name] = signal(element)
                            } else {
                                instance[name] = element
                            }
                        } else {
                            if (property.configuration?.signal) {
                                instance[name] = signal("")
                            } else {
                                instance[name] = element
                            }
                        }
                    }
                }
            }
        }
        return instance
    }
    return object
}