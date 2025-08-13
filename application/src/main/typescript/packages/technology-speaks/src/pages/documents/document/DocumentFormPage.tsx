import "./DocumentFormPage.css"
import React, {useContext, useRef, useState} from "react"
import Document from "../../../domain/document/Document";
import {
    Button,
    FormModel, JsFlag,
    JSONSerializer,
    MarkDownEditor,
    MarkDownView,
    Router,
    SchemaForm,
    SchemaInput,
    useForm,
    Window
} from "react-ui-simplicity";
import {process} from "../../Root";
import {createPortal} from "react-dom";
import navigate = Router.navigate;
import {v4} from "uuid";
import {SystemContext} from "react-ui-simplicity/src/System";

function DocumentFormPage(properties: DocumentFormPage.Attributes) {

    const {form} = properties

    const domain = useForm(form);

    const [open, setOpen] = useState(false)

    const {info} = useContext(SystemContext)

    const [buffer, setBuffer] = useState("")

    const scrollRef = useRef<HTMLDivElement>(null);

    async function onSubmit(name: string, form: FormModel) {
        let link = domain.$links[name];

        const response = await fetch("/service" + link.url, {
            body: JSON.stringify(JSONSerializer(domain)),
            headers: {"content-type": "application/json"},
            method: link.method
        })

        function startDocumentBatchProcessing() : WebSocket {
            let ws = new WebSocket(`wss://${info.host}/ws/document`)

            ws.onopen = () => {
                ws.send(domain.id);
                setOpen(true)
            }

            ws.onmessage = (e) => {
                let text = e.data

                if (text === "!Done!") {
                    ws.close()
                    setOpen(false)
                    navigate("/documents/search?index=0&limit=5")
                } else {
                    setBuffer((prev) => {
                        const next = prev + text;

                        requestAnimationFrame(() => {
                            if (scrollRef.current) {
                                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                            }
                        });

                        return next;
                    });
                }
            };

            ws.onclose = () => {
                setOpen(true)
                console.log("Disconnected");
            }

            return ws;
        }

        if (response.ok) {
            setOpen(true)

            let eventSource = startDocumentBatchProcessing();

            eventSource.onerror = (e) => {
                console.error(e)
                eventSource.close()

                setTimeout(() => {
                    eventSource = startDocumentBatchProcessing()
                }, 3000);
            }

        } else {
            if (response.status === 403) {
                process(response)
            } else {
                let errors = await response.json()
                form.setErrors(errors)
            }
        }
    }

    let actions = Object.values(domain.$links)
        .filter((link) => link.method !== "GET")
        .map((link) => <Button type={"submit"} key={link.rel} name={link.rel}>{link.title}</Button>)

    return (
        <div className={"document-form-page"}>
            {
                open && createPortal((
                    <Window centered={true} style={{width: "70%", height: "50vh"}}>
                        <Window.Header>
                            Server
                        </Window.Header>
                        <Window.Content>
                            <div ref={scrollRef} style={{overflowY: "auto", padding: "20px", height: "calc(50vh - 64px)", whiteSpace : "pre-wrap"}}>
                                <p>
                                    {buffer}
                                </p>
                            </div>
                        </Window.Content>
                    </Window>
                ), document.getElementById("viewport"))
            }
            <SchemaForm value={domain} onSubmit={onSubmit}
                        enctype={"multipart/form-data"}
                        redirect={`/documents/search?index=0&limit=5`}
                        style={{display: "flex", flexDirection: "column", width: "100%"}}>
                <SchemaInput name={"id"} style={{maxWidth : "800px"}}/>
                <SchemaInput name={"title"} style={{maxWidth : "800px"}}/>
                <div style={{flex: 1, display: "flex", height: "100%", flexWrap : "wrap"}}>
                    <MarkDownEditor name={"editor"} style={{flex: 1, minHeight : "600px", minWidth : "300px", maxWidth : "800px", width : "100%"}}/>
                    <JsFlag showWhenJs={true}>
                        <MarkDownView name={"editor"} style={{flex: 1, height: "100%", minWidth : "300px", maxWidth : "800px", width : "100%"}}/>
                    </JsFlag>
                </div>
                <div style={{display: "flex", justifyContent: "space-between", alignItems : "center"}}>
                    <JsFlag showWhenJs={false}>
                        <input type={"file"} name={"files"} multiple={true}/>
                    </JsFlag>
                    <div style={{display: "flex", justifyContent: "flex-end"}}>{actions}</div>
                </div>
            </SchemaForm>
        </div>
    )
}

namespace DocumentFormPage {
    export interface Attributes {
        form: Document
    }
}

export default DocumentFormPage