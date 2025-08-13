import {findClass, findConverter, findProperties} from "./Registry";
import ActiveObject from "../domain/container/ActiveObject";
import JSONSerializer from "./JSONSerializer";

export default function JSONDeserializer<T>(object: any, buildObjectGraph : boolean): T {
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
                if (instance[name] instanceof Array) {
                    instance[name].push(...element.map(item => JSONDeserializer(item, buildObjectGraph)))
                } else {
                    instance[name] = element.map(item => JSONDeserializer(item, buildObjectGraph))
                }
            } else {
                if (element instanceof Object) {
                    if (converter) {
                        instance[name] = converter.fromJson(element)
                    } else {
                        if (element.$type) {
                            instance[name] = JSONDeserializer(object[name], buildObjectGraph)
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
                } else {
                    let converter = findConverter(property.type);
                    if (converter) {
                        instance[name] = converter.fromJson(object[name])
                    } else {
                        if (element !== undefined) {
                            instance[name] = element
                        }
                    }
                }
            }

            let inSyncWith = property.configuration?.inSyncWith;
            if (inSyncWith) {
                let from = instance[inSyncWith.property]
                instance[inSyncWith.property] = inSyncWith.to(instance)
            }

        }
        return instance
    }
    return object
}