import "./SchemaFormArray.css"
import FormArray from "../../inputs/form/FormArray"
import React, {CSSProperties, useContext, useMemo} from "react"
import {SchemaFormContext} from "./SchemaForm"
import {configureValidators} from "../../shared/Model";
import {findClass} from "../../../mapper/Registry";
import ActiveObject from "../../../domain/container/ActiveObject";
import {traverseObjectGraph} from "../../../mapper/JSONMapper";
import CollectionDescriptor from "../../../domain/descriptors/CollectionDescriptor";
import NodeDescriptor from "../../../domain/descriptors/NodeDescriptor";
import Validable from "../../../domain/descriptors/Validable";

function SchemaFormArray(properties: SchemaFormArray.Attributes) {

    const {children, name, style} = properties

    const context = useContext(SchemaFormContext)

    const schema: CollectionDescriptor = context(name) as CollectionDescriptor

    if (!schema) {
        throw "No Schema found for " + name
    }

    const node = useMemo(() => {
        return (name: string) => {
            return schema.items.properties[name] as NodeDescriptor & Validable
        }
    }, [])

    const formArrayContext = useMemo(() => {
        return []
    }, []);

    const onCreate = () => {
        let Class = findClass(schema.items.type)
        let instance : ActiveObject = new Class.prototype.constructor()
        traverseObjectGraph(instance, schema.items)
        return instance
    }

    let validators = configureValidators(schema);

    return (
        <SchemaFormContext.Provider value={node}>
            <FormArray {...validators}
                       name={name}
                       style={style}
                       formArrayContext={formArrayContext}
                       onCreate={() => onCreate()}>
                {(elements: any[]) => children({elements, form: formArrayContext})}
            </FormArray>
        </SchemaFormContext.Provider>
    )
}

namespace SchemaFormArray {
    export interface Attributes {
        name: string
        children: (value: any) => React.ReactNode
        style? : CSSProperties
    }
}

export default SchemaFormArray