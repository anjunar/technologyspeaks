import React from "react"
import {Button, FormModel, JSONSerializer, Router, SchemaForm, SchemaInput, useForm} from "shared";
import navigate = Router.navigate;
import Credential from "../../domain/control/Credential";
import {process} from "../Root"

function LogoutPage(properties: LogoutPage.Attributes) {

    const {credential} = properties

    const domain = useForm(credential)

    const onSubmit = async (name: string, form: FormModel) => {
        let link = domain.$links[name];

        let value = JSONSerializer(domain);

        let response = await fetch("/service" + link.url, {
            method: link.method,
            body: JSON.stringify(value),
            headers: {"content-type": "application/json"}
        })

        if (response.ok) {
            navigate("/security/login", true)
        } else {
            if (response.status === 403) {
                process(response)
            } else {
                let errors = await response.json()
                form.setErrors(errors)
            }
        }
    }

    return (
        <div className={"logout-page"} style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
            <SchemaForm actionRel={"logout"} value={domain} style={{width : "300px"}} onSubmit={onSubmit}>
                <SchemaInput name={"value"}/>
                <Button name={"logout"}>Logout</Button>
            </SchemaForm>
        </div>
    )
}

namespace LogoutPage {
    export interface Attributes {
        credential: Credential
    }
}

export default LogoutPage
