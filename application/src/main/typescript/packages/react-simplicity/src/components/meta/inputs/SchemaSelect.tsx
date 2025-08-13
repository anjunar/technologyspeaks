import React, {useContext} from "react"
import Select from "../../inputs/select/Select"
import {SchemaFormContext} from "../forms/SchemaForm"
import {configureValidators, Validator} from "../../shared/Model";
import InputContainer from "../../inputs/container/InputContainer";
import EnumDescriptor from "../../../domain/descriptors/EnumDescriptor";

function SchemaSelect(properties: SchemaSelect.Attributes) {

    const {name, disabled, validators, ...rest} = properties

    const context = useContext(SchemaFormContext)

    const schema = context(name) as EnumDescriptor

    if (!schema) {
        throw new Error("Could not receive Schema for " + name)
    }

    return (
        <InputContainer placeholder={schema.title}>
            <Select name={name} disabled={disabled || schema.readOnly} {...rest} {...configureValidators(schema)} validators={validators}>
                {schema.enums.map(item => (
                    <Select.Option key={item}>{item}</Select.Option>
                ))}
            </Select>
            <InputContainer.Error key="server">{error => <span>{error.message}</span>}</InputContainer.Error>
            <InputContainer.Error key="required">{error => <span>darf nicht leer sein</span>}</InputContainer.Error>
        </InputContainer>
    )
}

namespace SchemaSelect {
    export interface Attributes {
        name: string
        disabled?: boolean
        validators? : Validator[]
        converter? : (value  : string) => any
    }
}

export default SchemaSelect