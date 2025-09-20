import ActiveObject, {Constructor} from "../domain/container/ActiveObject";
import {match} from "../pattern-match/PatternMatching";
import ObjectDescriptor from "../domain/descriptors/ObjectDescriptor";
import CollectionDescriptor from "../domain/descriptors/CollectionDescriptor";
import {NodeDescriptor} from "../domain/descriptors";
import PropDescriptor from "../domain/descriptors/PropDescriptor";
import JSONDeserializer from "./JSONDeserializer";
import JSONSerializer from "./JSONSerializer";
import {findType} from "./Registry";

export function traverseObjectGraph(object: any, schema: NodeDescriptor, prop: PropDescriptor) {

    if (object instanceof Function) {
        object.descriptor = schema
        object.instance = prop
        object = object()
    }

    if (object instanceof Object) {
        object.$instance = <E>(ctor : Constructor<E>) : E => {
            let type = findType(ctor);
            let result = JSONDeserializer<E>({ $type : type });
            let objectDescriptor = schema as ObjectDescriptor
            let nodeDescriptor = Object.values(objectDescriptor.properties).find(node => node.type === type);
            traverseObjectGraph(result, nodeDescriptor, prop)
            return result
        }

        Object.entries(object).filter(([key, value]) => value).forEach(([key, value] : [key : string, value : any]) => {

            if (value instanceof Function && key !== "$instance") {
                value = value()
            }

            if (schema instanceof ObjectDescriptor) {
                let node = schema.properties?.[key];

                if (!node) {
                    let find = schema.oneOf?.find(one => one.type === object.$type);
                    if (find) {
                        node = find.properties[key]
                    } else {
                        if (value instanceof ActiveObject) {
                            // delete object[key]
                        }
                    }
                }

                match(node)
                    .withObject(CollectionDescriptor, (array) => (value as any[]).forEach(row => {
                        if (row instanceof Object) {
                            traverseObjectGraph(row, array.items as ObjectDescriptor, object.$meta.instance[key])
                        }
                    }))

                    .withObject(ObjectDescriptor, (jsonObject) => traverseObjectGraph(value, jsonObject, object.$meta?.instance?.[key] || {}))
                    .withObject(NodeDescriptor, (jsonObject) => traverseObjectGraph(value, jsonObject, object.$meta?.instance?.[key] || {}))
                    .nonExhaustive()
            }
        })
    }

}

export const Mapper = {
    domain(object : any) : any {
        let deserialized : any = JSONDeserializer(object);
        if (deserialized.$meta) {
            traverseObjectGraph(deserialized, deserialized.$meta.descriptors, deserialized.$meta.instance)
        }
        return deserialized
    },
    toJson(object : any) : any  {
        return JSONSerializer(object)
    }
}