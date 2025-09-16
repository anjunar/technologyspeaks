import JSONDeserializer from "./JSONDeserializer";
import ActiveObject from "../domain/container/ActiveObject";
import LinkContainer from "../domain/container/LinkContainer";
import Table from "../domain/container/Table";
import {match} from "../pattern-match/PatternMatching";
import {findSchemaProperties} from "./Registry";
import ObjectDescriptor from "../domain/descriptors/ObjectDescriptor";
import CollectionDescriptor from "../domain/descriptors/CollectionDescriptor";
import QueryTable from "../domain/container/QueryTable";
import {AbstractSearch} from "../domain/container";

export function traverseObjectGraph(object : any, schema : ObjectDescriptor, buildObjectGraph : boolean = true) {

    let schemaProperties = findSchemaProperties(object.constructor)

    for (const schemaProperty of schemaProperties) {
        schema.properties[schemaProperty.name] = JSONDeserializer(schemaProperty.configuration.schema, buildObjectGraph)
    }

    Object.entries(object).filter(([key, value]) => value).forEach(([key, value]) => {
        let node = schema.properties?.[key];

        if (! node) {
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
                    traverseObjectGraph(row, array.items as ObjectDescriptor, buildObjectGraph)
                }
            }))
            .withObject(ObjectDescriptor, (jsonObject) => traverseObjectGraph(value, jsonObject, buildObjectGraph))
            .nonExhaustive()
    })

}