import React, {CSSProperties, useContext} from "react"
import {SchemaFormContext} from "../forms/SchemaForm"
import Image from "../../inputs/upload/image/Image";

function SchemaImage(properties : SchemaImage.Attributes) {

    const { name, disabled, ...rest } = properties

    const schemaContext = useContext(SchemaFormContext)

    const schema = schemaContext(name)

    if (!schema) {
        throw "No Schema found for " + name
    }

    return (
        <Image name={name} placeholder={schema.title} disabled={disabled || schema.readOnly} {...rest}/>
    )
}

namespace SchemaImage {
    export interface Attributes {
        name : string
        style? : CSSProperties
        disabled? : boolean
    }
}

export default SchemaImage