import React from "react"
import ManagedProperty from "../../domain/shared/ManagedProperty";
import {Button, FormModel, JSONSerializer, SchemaForm, SchemaInput, SchemaLazySelect, useForm} from "react-ui-simplicity";

function SecuredPropertyForm(properties: SecuredPropertyForm.Attributes) {

    const {form, onClose} = properties

    const domain = useForm(form)

    async function onSubmit(name : string, form : FormModel) {

        let link = domain.$links[name]
        let body = JSONSerializer(domain)
        let response = await fetch(`/service${link.url}`, {
            method : link.method,
            body : JSON.stringify(body),
            headers : {"content-type" : "application/json"}
        })

        if (! response.ok) {
            form.setErrors(await response.json())
        } else {
            onClose()
        }
    }

    return (
        <div>
            <SchemaForm value={domain} onSubmit={onSubmit}>
                <SchemaInput name={"visibleForAll"}/>
                <SchemaLazySelect name={"groups"}/>
                <Button name={"update"}>Update</Button>
            </SchemaForm>
        </div>
    )
}

namespace SecuredPropertyForm {
    export interface Attributes {
        form : ManagedProperty
        onClose() : void
    }
}

export default SecuredPropertyForm