import ActiveObject, {Constructor} from "../domain/container/ActiveObject";
import {match} from "../pattern-match/PatternMatching";
import ObjectDescriptor from "../domain/descriptors/ObjectDescriptor";
import CollectionDescriptor from "../domain/descriptors/CollectionDescriptor";
import {NodeDescriptor} from "../domain/descriptors";
import PropertyDescriptor from "../domain/descriptors/PropertyDescriptor";
import JSONDeserializer from "./JSONDeserializer";
import JSONSerializer from "./JSONSerializer";
import {findType} from "./Registry";
import {Type} from "@angular/core";

export function traverseObjectGraph(object: any, schema: NodeDescriptor, prop: PropertyDescriptor) {

    if (object instanceof Function) {
        object.descriptor = prop
        object = object()
    }

    if (object instanceof Object) {
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
                    .withObject(CollectionDescriptor, (array) => (value as any || []).forEach((row : any) => {
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
    domain(object : any, clazz? : Type<any>) : any {
        let deserialized : any = JSONDeserializer(object, clazz);
        if (deserialized.$meta) {
            traverseObjectGraph(deserialized, null, deserialized.$descriptors)
        }
        return deserialized
    },
    toJson(object : any) : any  {
        return JSONSerializer(object)
    }
}