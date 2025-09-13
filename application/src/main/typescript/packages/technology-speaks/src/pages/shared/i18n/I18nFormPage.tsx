import React from 'react';
import I18n from "../../../domain/shared/i18n/I18n";
import {
    Button,
    FormModel,
    JSONSerializer, Router,
    SchemaForm,
    SchemaFormArray,
    SchemaImage,
    SchemaInput,
    useForm
} from "shared";
import SubForm from "react-ui-simplicity/src/components/inputs/form/SubForm";
import Translation from "../../../domain/shared/i18n/Translation";
import {v4} from "uuid";
import {process} from "../../Root";
import navigate = Router.navigate;

export function I18NFormPage(properties: I18NFormPage.Attributes) {

    const {form} = properties

    let domain = useForm(form);

    async function onSubmit(name: string, form: FormModel) {
        let link = domain.$links[name];

        const response = await fetch("/service" + link.url, {
            body : JSON.stringify(JSONSerializer(domain)),
            headers: {"content-type": "application/json"},
            method : link.method
        })

        if (response.ok) {
            navigate("/shared/i18ns/search")
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
        .map((link) => <Button key={link.rel} name={link.rel}>{link.title}</Button>)

    return (
        <div className={"i18n-form-page"}>
            <div className={"center-horizontal"} style={{width : "100%", height : "100%"}}>
                <SchemaForm value={domain} onSubmit={onSubmit} style={{minWidth : "360px", maxWidth : "800px", width : "100%"}}>
                    <SchemaInput name={"text"}/>
                    <SchemaFormArray name={"translations"}>
                        {({elements, form}: { elements: Translation[], form: any }) =>
                            elements?.map((element, index) => (
                                <SubForm key={element.locale} index={index}>
                                    <div style={{display : "flex", width : "100%"}}>
                                        <SchemaInput name={"locale"}/>
                                        <SchemaInput name={"text"} style={{flex : 1}}/>
                                        <button type={"button"} className={"material-icons"}
                                                onClick={() => elements.splice(elements.indexOf(element), 1)}>
                                            delete
                                        </button>
                                    </div>
                                </SubForm>
                            ))
                        }
                    </SchemaFormArray>
                    <div style={{display : "flex", justifyContent : "flex-end"}}>{ actions }</div>
                </SchemaForm>
            </div>
        </div>
    )
}

namespace I18NFormPage {
    export interface Attributes {
        form : I18n
    }
}

export default I18NFormPage;