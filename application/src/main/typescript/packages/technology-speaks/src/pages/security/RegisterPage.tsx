import React, {useEffect} from "react"
import * as webauthnJson from "@github/webauthn-json";
import {UAParser} from 'ua-parser-js';
import {Button, JSONSerializer, Router, SchemaForm, SchemaInput, useForm} from "react-ui-simplicity";
import Login from "../../domain/security/Login";
import navigate = Router.navigate;


function RegisterPage(properties: RegisterPage.Attributes) {

    const {register} = properties

    const domain = useForm(register)

    async function registerAction() {

        let value = JSONSerializer(domain)

        const optionsRequest = await fetch("/service/security/register-options", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(value)
        })

        const credentialCreateOptions = await optionsRequest.json()

        const publicKeyCredential = await webauthnJson.create(credentialCreateOptions);

        const registerRequest = await fetch("/service/security/register-finish", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(publicKeyCredential)
        });

        const registerJSON = await registerRequest.json()

        if (registerRequest.ok) {
            navigate("/security/login")
        } else {
            alert("Something went wrong")
        }

    }

    return (
        <div className={"register-page"} style={{display : "flex", justifyContent : "center", alignItems : "center", height : "100%"}}>
            <div>
                <h1>Register</h1>
                <SchemaForm value={domain} onSubmit={registerAction} style={{width : "300px"}}>
                    <SchemaInput name={"username"}/>
                    <SchemaInput name={"displayName"}/>
                    <Button name={"register"} style={{float : "right"}}>Register</Button>
                </SchemaForm>
            </div>
        </div>
    )
    }

namespace RegisterPage {
    export interface Attributes {
        register : Login
    }
}

export default RegisterPage