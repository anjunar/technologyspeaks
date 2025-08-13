import "./DocumentViewPage.css"
import React from "react"
import Document from "../../../domain/document/Document";
import {Form, Link, MarkDownView, Router} from "react-ui-simplicity";
import navigate = Router.navigate;
import onLink = Link.onLink;
import link from "react-ui-simplicity/src/components/navigation/link/Link";

function DocumentViewPage(properties: DocumentViewPage.Attributes) {

    const {form} = properties

    return (
        <div className={"document-view-page"}>
            <div className={"center-horizontal"}>
                <div style={{maxWidth: "800px", minWidth: "360px", height: "100%"}}>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <div style={{display: "flex", alignItems: "baseline", gap: "12px"}}>
                            <h1>{form.title}</h1>
                        </div>
                        <div style={{display : "flex", gap : "12px"}}>
                            {
                                onLink(form.$links, "read", link => (
                                    <Link key={link.rel} className={"material-icons"} value={link.url}>markdown</Link>
                                ))
                            }
                            {
                                onLink(form.$links, "revisions", link => (
                                    <Link key={link.rel} className={"material-icons"} value={link.url}>history</Link>
                                ))
                            }
                        </div>
                    </div>

                    <div style={{display: "flex", gap: "5px", flexWrap: "wrap"}}>
                        {
                            form.hashTags?.map(hashTag => (<small key={hashTag.value}>{hashTag.value}</small>))
                        }
                    </div>

                    <MarkDownView value={form.editor}/>
                </div>
            </div>
        </div>
    )
}

namespace DocumentViewPage {
    export interface Attributes {
        form: Document
    }
}

export default DocumentViewPage