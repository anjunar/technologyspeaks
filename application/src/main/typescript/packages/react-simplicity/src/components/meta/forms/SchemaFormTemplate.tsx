import "./SchemaFormTemplate.css"
import React from 'react';
import SchemaForm from "./SchemaForm";
import {ActiveObject} from "../../../domain/container";
import {FormModel} from "../../shared";
import {JSONSerializer} from "../../../mapper";
import {useForm} from "../../../hooks";
import {Button} from "../../inputs/button";
import renderButtons = Button.renderButtons;

export function SchemaFormTemplate(properties: SchemaFormTemplate.Attributes) {

    const {value, children, onError, onSuccess} = properties

    let domain = useForm(value)

    async function onSubmit(name: string, form: FormModel) {
        let link = domain.$links[name];

        const response = await fetch("/service" + link.url, {
            body: JSON.stringify(JSONSerializer(domain)),
            headers: {"content-type": "application/json"},
            method: link.method
        })

        if (response.ok) {
            if (onSuccess) {
                onSuccess()
            }
        } else {
            const result = await response.json()
            form.setErrors(result)

            if (onError) {
                onError()
            }
        }
    }

    return (
        <div className={"schema-form-template"}>
            <SchemaForm value={domain} onSubmit={onSubmit} enctype={"multipart/form-data"}>
                {children}
                <div style={{display: "flex", justifyContent: "flex-end", gap: "5px"}}>
                    {renderButtons(domain.$links)}
                </div>
            </SchemaForm>
        </div>
    )
}

export namespace SchemaFormTemplate {
    export interface Attributes {
        value: ActiveObject
        children: React.ReactNode
        onSuccess?: () => {}
        onError?: () => {}
    }
}

export default SchemaFormTemplate

