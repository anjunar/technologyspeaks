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

    object.$meta = (name : string) => {
        let property = schema.properties[name];

        if (property) {
            return property
        }

        return schema.oneOf.find(one => one.type === object.$type).properties[name]
    }

    object.$descriptors = schema

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

export function mapForm<T extends ActiveObject>(object : any, buildObjectGraph : boolean = false) : T {
    let entity : T = JSONDeserializer(object, buildObjectGraph);

    traverseObjectGraph(entity, entity.$descriptors, buildObjectGraph)

    return entity
}

export function mapTable<S extends AbstractSearch,T extends ActiveObject>(object : any, buildObjectGraph : boolean = false) : [T[], number, LinkContainer, ObjectDescriptor, S] {
    let entity : QueryTable<S, T> = JSONDeserializer(object, buildObjectGraph);

    traverseObjectGraph(entity, entity.$descriptors, buildObjectGraph)

    return [entity.rows || [], entity.size, entity.$links, entity.$descriptors, entity.search]
}