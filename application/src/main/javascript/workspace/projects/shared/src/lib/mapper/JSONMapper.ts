import ActiveObject from "../domain/container/ActiveObject";
import {match} from "../pattern-match/PatternMatching";
import ObjectDescriptor from "../domain/descriptors/ObjectDescriptor";
import CollectionDescriptor from "../domain/descriptors/CollectionDescriptor";
import {NodeDescriptor} from "../domain/descriptors";
import PropDescriptor from "../domain/descriptors/PropDescriptor";

export function traverseObjectGraph(object: any, schema: NodeDescriptor, prop: PropDescriptor) {

    if (object instanceof Function) {
        object.descriptor = schema
        object.instance = prop
        object = object()
    }

    Object.entries(object).filter(([key, value]) => value).forEach(([key, value]) => {
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

                .withObject(ObjectDescriptor, (jsonObject) => traverseObjectGraph(value, jsonObject, object.$meta.instance[key]))
                .withObject(NodeDescriptor, (jsonObject) => traverseObjectGraph(value, jsonObject, object.$meta.instance[key]))
                .nonExhaustive()
        }
    })

}