import "./SchemaSubForm.css"
import React, {CSSProperties, useContext, useMemo} from "react"
import SubForm from "../../inputs/form/SubForm"
import {SchemaFormContext} from "./SchemaForm"
import {FormContext} from "../../inputs/form/Form";
import ObjectDescriptor from "../../../domain/descriptors/ObjectDescriptor";
import NodeDescriptor from "../../../domain/descriptors/NodeDescriptor";
import Validable from "../../../domain/descriptors/Validable";

function SchemaSubForm(properties: SchemaSubForm.Attributes) {

    const {children, name, subType, style, ...rest} = properties

    const schemaContext = useContext(SchemaFormContext)

    const formContext = useContext(FormContext)

    const schema: ObjectDescriptor = schemaContext(name) as ObjectDescriptor & Validable

    if (!schema) {
        throw "No Schema found for " + name
    }

    const node = useMemo(() => {
        return (name: string) => {
            if (schema?.properties) {
                let property = schema.properties[name]
                if (property) {
                    return property as NodeDescriptor & Validable
                } else {
                    return null
                    if (subType && schema.oneOf) {
                        let jsonObject = schema.oneOf.find(node => subType === node.type)
                        if (jsonObject) {
                            return jsonObject.properties[name] as NodeDescriptor & Validable
                        }
                    }
                }
            }
            return null
        }
    }, [])

    return (
        <SchemaFormContext.Provider value={node}>
            <SubForm name={name} subType={subType} style={style} {...rest}>
                {children}
            </SubForm>
        </SchemaFormContext.Provider>
    )
}

namespace SchemaSubForm {
    export interface Attributes {
        children: React.ReactNode
        name: string
        subType?: string,
        className? : string,
        style? : CSSProperties
    }
}

export default SchemaSubForm