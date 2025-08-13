import Input from "../../inputs/input/Input"
import React, {CSSProperties, useContext} from "react"
import {SchemaFormContext} from "../forms/SchemaForm"
import {AsyncValidator, configureValidators, Validator} from "../../shared/Model";
import {FormContext} from "../../inputs/form/Form";
import InputContainer from "../../inputs/container/InputContainer";
import NodeDescriptor from "../../../domain/descriptors/NodeDescriptor";
import Validable from "../../../domain/descriptors/Validable";

function SchemaInput(properties: SchemaInput.Attributes) {

    const {schema, value, name, disabled, validators, children, style, ...rest} = properties

    const context = useContext(SchemaFormContext)

    const formContext = useContext(FormContext)

    let contextSchema: NodeDescriptor & Validable;
    if (context && name) {
        contextSchema = context(name)
    } else {
        contextSchema = schema
    }


    let configureNumber = (property: NodeDescriptor) => {
        if (property.widget === "number") {
            return {
                min: 0,
                step: property.step
            }
        }
        return {}
    }

    let asyncValidators = () => {
        let link = contextSchema.links?.validate;

        if (link) {
            return [new class implements AsyncValidator {
                type: string = "unique"

                validate(value: any): Promise<void> {
                    return new Promise((resolve, reject) => {

                        fetch("/service" + link.url, {
                            body: value,
                            method: link.method,
                            headers: {"content-type": "application/json"}
                        })
                            .then(response => response.json())
                            .then(response => {
                                if (formContext.value["id"] === response) {
                                    resolve()
                                } else {
                                    reject()
                                }
                            })
                            .catch(response => {
                                resolve()
                            })

                    });
                }
            }]
        }

        return undefined
    }

    function getDisabled() {
        if (contextSchema.hidden) {
            return false
        }
        return disabled || contextSchema.readOnly;
    }

    if (! contextSchema) {
        return <div>No Context found for {name}</div>
    }

    return (
        <InputContainer name={name} placeholder={contextSchema.title} style={{display : contextSchema.hidden ? "none" : "block",...style}}>
            <Input
                type={contextSchema.widget}
                value={value}
                name={name}
                disabled={getDisabled()}
                asyncValidators={asyncValidators()}
                validators={validators}
                {...configureNumber(contextSchema)}
                {...configureValidators(contextSchema)}
                {...rest}
            />
            {children}
            <InputContainer.Error key="server">{error => <span>{error.message}</span>}</InputContainer.Error>
            <InputContainer.Error key="email">{error => <span>Muss eine Email sein</span>}</InputContainer.Error>
            <InputContainer.Error key="required">{error => <span>darf nicht leer sein</span>}</InputContainer.Error>
            <InputContainer.Error key="minLength">{error => <span>mehr als {error["min"]} Zeichen</span>}</InputContainer.Error>
            <InputContainer.Error key="maxLength">{error => <span>weniger als {error["max"]} Zeichen</span>}</InputContainer.Error>
        </InputContainer>
    )
}

namespace SchemaInput {
    export interface Attributes {
        schema?: NodeDescriptor & Validable
        value?: any
        dynamicWidth? : boolean
        subType? : string
        name?: string
        autoComplete? : string
        disabled?: boolean
        children?: React.ReactNode
        style?: CSSProperties
        onChange?: any,
        validators? : Validator[]
    }
}

export default SchemaInput