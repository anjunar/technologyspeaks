import React, {CSSProperties, useContext} from "react"
import LazySelect from "../../inputs/select/lazy/LazySelect"
import {SchemaFormContext} from "../forms/SchemaForm"
import {match} from "../../../pattern-match/PatternMatching";
import NotNullValidator from "../../../domain/descriptors/validators/NotNullValidator";
import NotBlankValidator from "../../../domain/descriptors/validators/NotBlankValidator";
import SizeValidator from "../../../domain/descriptors/validators/SizeValidator";
import {Validator} from "../../shared/Model";
import {mapTable} from "../../../mapper/JSONMapper";
import NodeDescriptor from "../../../domain/descriptors/NodeDescriptor";
import ObjectDescriptor from "../../../domain/descriptors/ObjectDescriptor";
import CollectionDescriptor from "../../../domain/descriptors/CollectionDescriptor";
import Validable from "../../../domain/descriptors/Validable";
import InputContainer from "../../inputs/container/InputContainer";
import withPageable from "../../shared/Pageable";
import Loader = withPageable.Loader;
import Query = withPageable.Query;
import Callback = withPageable.Callback;
import {FormContext} from "../../inputs/form/Form";

function namingMultiselect(option: any, schema: ObjectDescriptor) : string {
    return Reflect.ownKeys(option)
        .filter((key: any) => {
            if (schema.properties) {
                return schema.properties[key]?.name === true
            } else {
                return schema.oneOf.some(object => {
                    return object.properties[key]?.name === true
                })
            }
        })
        .map((key) => {
            let value = option[key];
            if (typeof value === "string") {
                return value
            } else {
                return namingMultiselect(value, schema.properties[key as string] as ObjectDescriptor)
            }
        })
        .join(" ");
}

function SchemaLazySelect(properties: SchemaLazySelect.Attributes) {

    const context = useContext(SchemaFormContext)

    const formContext = useContext(FormContext)

    let contextSchema = context(properties.name)

    const {schema, name, validators, disabled, multiSelect = contextSchema.type === "Set" || contextSchema.type === "List", ...rest} = properties

    let loader = new (class extends Loader {
        async onLoad(query: Query, callback: Callback) {
            let link = Object.values(contextSchema.links || {}).find(link => link.rel === "list")

            if (link) {
                let response = await fetch("/service" + link.url + `?index=${query.index}&limit=${query.limit}`)

                if (response.ok) {
                    const [table, size] = mapTable(await response.json())

                    return callback(table, query.index, size)
                }
            }
        }
    })()

    let selectOption = (option: any) => {
        if (multiSelect) {
            let schema = contextSchema as CollectionDescriptor
            return namingMultiselect(option, schema.items)
        } else {
            let schema = contextSchema as ObjectDescriptor & Validable
            return namingMultiselect(option, schema)
        }
    }

    let configureValidators = (property: NodeDescriptor & Validable): any => {
        return Object.values(property.validators || {}).reduce((current: any, prev: any) => {
            match(prev)
                .withObject(NotNullValidator, () => current["required"] = true)
                .withObject(NotBlankValidator, () => current["required"] = true)
                .withObject(SizeValidator, (validator) => {
                    if (validator.min) {
                        current["min"] = validator.min
                    }
                    if (validator.max) {
                        current["max"] = validator.max
                    }
                })
                .exhaustive()
            return current
        }, {} as any)
    }


    return (
        <InputContainer name={name} placeholder={contextSchema.title} {...rest}>
            <LazySelect
                disabled={disabled || ! formContext.value["$instance"][name].writeable}
                name={name}
                loader={loader}
                getName={selectOption}
                getId={(option: any) => option.id}
                multiSelect={multiSelect}
                validators={validators}
                {...configureValidators(contextSchema)}
            >
                <LazySelect.Option>
                    {({option, index, selected}) => {
                        if (selected) {
                            return (
                                <div>
                                    <strong>{selectOption(option)}</strong>
                                </div>
                            )
                        } else {
                            return <div>{selectOption(option)}</div>
                        }
                    }}
                </LazySelect.Option>
            </LazySelect>
            <InputContainer.Error key="server">{error => <span>{error.message}</span>}</InputContainer.Error>
            <InputContainer.Error key="required">{error => <span>darf nicht leer sein</span>}</InputContainer.Error>
            <InputContainer.Error key="min">{error => <span>Größe muss mehr als {error["min"]} sein</span>}</InputContainer.Error>
            <InputContainer.Error key="max">{error => <span>Größe muss weniger als {error["max"]} sein</span>}</InputContainer.Error>
        </InputContainer>
    )
}

namespace SchemaLazySelect {
    export interface Attributes {
        schema?: NodeDescriptor & Validable
        name?: string
        multiSelect?: boolean
        disabled?: boolean
        style?: CSSProperties
        value?: any
        onChange?: any,
        validators?: Validator[]
    }
}

export default SchemaLazySelect