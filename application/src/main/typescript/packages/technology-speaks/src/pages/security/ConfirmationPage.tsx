import React from "react"
import Confirmation from "../../domain/security/Confirmation";
import {Button, FormModel, JSONSerializer, SchemaForm, SchemaInput, useForm} from "shared";

function ConfirmationPage(properties: ConfirmationPage.Attributes) {

    const {form} = properties
    
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
        }
    }

    return (
        <div className={"confirmation-page"} style={{display : "flex", justifyContent : "center", alignItems : "center", height : "100%"}}>
            <SchemaForm value={domain} onSubmit={onSubmit}>
                <SchemaInput name={"code"}/>
                <Button name={"confirm"}>Confirm</Button>
                {
                    Object.entries(domain.$links).map(([key, link]) => (
                        <Button key={key} name={key}>Resend to {key.split(":")[1]}</Button>
                    ))
                }
            </SchemaForm>
        </div>
    )
}

namespace ConfirmationPage {
    export interface Attributes {
        form : Confirmation
    }
}

export default ConfirmationPage