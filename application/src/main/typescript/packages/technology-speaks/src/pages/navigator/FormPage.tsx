import "./FormPage.css"
import React, {useEffect, useState} from "react"
import {
    ActiveObject,
    Button,
    FormModel,
    FormSchemaFactory,
    JSONSerializer,
    Link,
    Router,
    SchemaForm,
    useForm
} from "shared";
import * as webauthnJson from "@github/webauthn-json";
import SecuredProperty from "../../components/security/SecuredProperty";
import {v4} from "uuid";
import QueryParams = Router.QueryParams;
import navigate = Router.navigate;

function FormPage(properties: FormView.Attributes) {

    const {queryParams} = properties

    let url = atob(queryParams.link as string || "")

    const domain = useForm(properties.form);

    const [session, setSession] = useState("")

    function generateLinks() {
        if (domain.$links) {
            let links1 = Object.entries(domain.$links)
                .filter(([rel, link]) => link.method === "GET" || link.linkType === "table")
                .map(([rel, link]) => (
                    <Link style={{margin: "5px"}}
                          key={link.rel}
                          value={`/navigator/${link.linkType}?link=${btoa(link.url)}`}>
                        {link.title}
                    </Link>
                ))
            return links1
        }
        return []
    }

    let links1 = generateLinks()

    let actions = Object.entries(domain.$links || {})
        .filter(([rel, link]) => link.method !== "GET" && link.linkType !== "table")
        .map(([rel, link]) => (
            <span key={link.rel}>
                <Button name={link.rel}>
                    {link.title}
                </Button>
                <Button name={link.rel + "-force"}>
                    {link.title} Force
                </Button>
            </span>
        ))

    let fields = Object.entries(domain.$descriptors.allProperties(domain.$type))
        .filter(([key, descriptor]) => {
            return !descriptor.hidden
        })
        .map(([key, descriptor]) => (
            <div key={key} style={{display: "flex", alignItems: "center"}}>
                <FormSchemaFactory style={{flex: 1}} name={key}/>
                {
                    descriptor.links?.["secured"] && <SecuredProperty descriptor={descriptor}/>
                }
            </div>

        ))

    async function login() {

        let value = JSONSerializer(domain);

        const credentialGetOptions = await fetch('/service/security/options', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(value),
        }).then(resp => resp.json());

        const publicKeyCredential = await webauthnJson.get(credentialGetOptions);

        const responseFinish = await fetch('/service/security/finish', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(publicKeyCredential),
        });

        if (!responseFinish.ok) {
            alert("Something went wrong")
        }

    }

    async function register() {
        let value = JSONSerializer(domain);

        const optionsRequest = await fetch("/service/security/register-options", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(value)
        })

        const credentialCreateOptions = await optionsRequest.json()

        const publicKeyCredential = await webauthnJson.create(credentialCreateOptions);

        const registerRequest = await fetch("service/security/register-finish", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(publicKeyCredential)
        });

        const registerJSON = await registerRequest.json()

        if (!registerRequest.ok) {
            alert("Something went wrong")
        }

    }

    const onSubmit = async (name: string, form: FormModel) => {
        let link = domain.$links[name];

        switch (link.url) {
            case "/security/register-options" :
                register()
                break
            case "/security/options" :
                login()
                break
            default : {
                let value = JSONSerializer(domain);

                let sessionId = v4()

                setTimeout(() => {
                    setSession(sessionId)
                }, 1000)


                let response = await fetch("/service" + link.url, {
                    method: link.method,
                    body: JSON.stringify(value),
                    headers: {"content-type": "application/json", "X-Session-Id": sessionId}
                })

                if (response.ok) {
                    navigate("/navigator/form", true)
                } else {
                    let errors = await response.json()
                    form.setErrors(errors)
                }
            }
        }

    }

    useEffect(() => {
        let eventSource = null
        let counter = 0
        if (session.length > 0) {
            eventSource = new EventSource(`/service/documents/document/progressStream?session=${session}`);

            eventSource.onmessage = (e) => {
                console.log("Fortschritt:", e.data);

                if (e.data === "Done") {
                    eventSource.close()
                }
            };

            eventSource.onopen = () => console.log("SSE-Verbindung geöffnet");
            eventSource.onerror = (e) => {
                console.error("SSE-Fehler", e);
                eventSource.close()
            }

        }

        return () => {
            if (eventSource) {
                eventSource.close()
            }
        }
    }, [session]);

    return (
        <div>
            {url}
            <br/>
            {links1}
            <SchemaForm value={domain} onSubmit={onSubmit}>
                {fields}
                {actions}
            </SchemaForm>
        </div>
    )
}

namespace FormView {
    export interface Attributes {
        queryParams: QueryParams
        form: ActiveObject
    }
}

export default FormPage