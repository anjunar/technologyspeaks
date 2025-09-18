import {findConverter, findProperties} from "./Registry";

export default function JSONSerializer(entity: any) : any {
    if (entity instanceof Array) {
        return entity.map(element => JSONSerializer(element))
    } else {
        if (entity instanceof Object) {
            let converter = findConverter(entity.constructor);
            if (converter) {
                return converter.toJson(entity)
            }
            let properties = findProperties(entity.constructor);
            return properties
                .filter(property => ! property.name.startsWith("$") || property.name === "$type")
                .reduce((prev, current) => {
                let object = entity[current.name];

                if (object instanceof Function) {
                    object = object()
                }

                if (object instanceof Array) {
                    prev[current.name] = object.map(item => JSONSerializer(item))
                } else {
                    if (object instanceof Object) {
                        let converter = findConverter(current.type);
                        if (converter) {
                            prev[current.name] = converter.toJson(object)
                        } else {
                            if (object.$type) {
                                prev[current.name] = JSONSerializer(object)
                            } else {
                                prev[current.name] = Object.entries(object)
                                    .reduce((prev, [key, value]) => {
                                        if (value instanceof Array) {
                                            prev[key] = value.map(item => JSONSerializer(item))
                                            return prev
                                        } else {
                                            prev[key] = JSONSerializer(value)
                                            return prev
                                        }
                                    }, {} as any)
                            }
                        }
                    } else {
                        let converter = findConverter(current.type);
                        if (converter) {
                            prev[current.name] = converter.toJson(object)
                        } else {
                            prev[current.name] = object
                        }
                    }
                }
                return prev
            }, {} as any)

        }
        return entity
    }
}