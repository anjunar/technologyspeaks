import React from "react"
import * as webauthnJson from "@github/webauthn-json";
import {
    Button, Form, Input,
    JsFlag,
    JSONSerializer, mapForm,
    Router,
    SchemaForm,
    SchemaInput,
    useForm
} from "shared";
import navigate = Router.navigate;
import Login from "../../domain/security/Login";

function LoginPage(properties: LoginPage.Attributes) {

    const domain = useForm(mapForm<Login>({$type : "Login"}, true))

    async function loginAction() {

        let value = JSONSerializer(domain)

        const credentialGetOptions = await fetch('/service/security/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(value),
        }).then(resp => resp.json());

        const publicKeyCredential = await webauthnJson.get(credentialGetOptions);

        const responseFinish = await fetch('/service/security/login/finish', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username : domain.username,
                publicKeyCredential
            }),
        });

        if (responseFinish.ok) {
            let link = responseFinish.headers.get("Link");
            if (link) {
                let regex = /<([^>]+)>; rel="(.+)"/g
                let exec = regex.exec(link);
                navigate(exec[1], true)
            } else {
                const params = new URLSearchParams(window.location.search)
                let redirect = params.get("redirect");
                navigate(redirect ? decodeURIComponent(redirect) : "/", true)
            }
        } else {
            alert("Something went wrong")
        }

    }

    return (
        <div className={"login-page"} style={{display : "flex", justifyContent : "center", alignItems : "center", height : "100%"}}>
            <div>
                <h1>Login</h1>
                <Form value={domain} onSubmit={loginAction} style={{width : "300px"}}>
                    <Input name={"username"}/>
                    <JsFlag showWhenJs={false}>
                        <Input name={"password"}/>
                    </JsFlag>
                    <div style={{display : "flex", justifyContent : "flex-end"}}>
                        <JsFlag showWhenJs={true}>
                            <Button name={"login"}>Login</Button>
                        </JsFlag>
                        <JsFlag showWhenJs={false}>
                            <Button name={"fallback"}>Login</Button>
                        </JsFlag>
                    </div>
                </Form>
            </div>
        </div>
    )
}

namespace LoginPage {
    export interface Attributes {}
}

export default LoginPage