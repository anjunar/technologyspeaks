import React, {useEffect} from "react"
import * as webauthnJson from "@github/webauthn-json";
import {UAParser} from 'ua-parser-js';
import {
    Button,
    Form,
    Input,
    JSONSerializer,
    mapForm,
    Router,
    SchemaForm,
    SchemaInput,
    useForm
} from "shared";
import Login from "../../domain/security/Login";
import navigate = Router.navigate;


function RegisterPage(properties: RegisterPage.Attributes) {

    const {browser, cpu, os, device} = UAParser(navigator.userAgent);

    const domain = useForm<Login>(mapForm<Login>({$type : "Login", displayName : `${browser.name} on ${os.name} ${os.version} ${device.type ? device.type.substring(0, 1).toUpperCase() + device.type.substring(1) : "Desktop"}`}, true))

    async function registerAction() {

        let value = JSONSerializer(domain)

        const optionsRequest = await fetch("/service/security/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(value)
        })

        const credentialCreateOptions = await optionsRequest.json()

        try {
            const publicKeyCredential = await webauthnJson.create(credentialCreateOptions);

            const registerRequest = await fetch("/service/security/register/finish", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    username: domain.username,
                    publicKeyCredential
                })
            });

            if (registerRequest.ok) {
                navigate("/security/login")
            } else {
                alert("Something went wrong")
            }
        } catch (e) {
            alert(e)
        }

    }

    return (
        <div className={"register-page"} style={{display : "flex", justifyContent : "center", alignItems : "center", height : "100%"}}>
            <div>
                <h1>Register</h1>
                <Form value={domain} onSubmit={registerAction} style={{width : "300px"}}>
                    <Input name={"username"}/>
                    <Input name={"displayName"}/>
                    <Button name={"register"} style={{float : "right"}}>Register</Button>
                </Form>
            </div>
        </div>
    )
    }

namespace RegisterPage {
    export interface Attributes {}
}

export default RegisterPage