import React from "react"
import {AbstractSearch, ActiveObject, Button, FormSchemaFactory, SchemaForm, useForm} from "react-ui-simplicity";

function Search(properties: Search.Attributes) {

    const {value, submit} = properties

    let domain : AbstractSearch = useForm(value);

    let fields = Object.entries(domain.$descriptors?.properties)
        .filter(([key, descriptor]) => ! descriptor.hidden)
        .map(([key, descriptor]) => (
            <div key={key} style={{display: "flex", alignItems: "center"}}>
                <FormSchemaFactory style={{flex: 1}} name={key}/>
            </div>
        ))

    function onSubmit(name: string, form: any) {
        submit(domain)
    }

    return (
        <div>
            <SchemaForm value={domain} onSubmit={onSubmit}>
                {
                    fields
                }
                <Button name={"search"}>Send</Button>
            </SchemaForm>
        </div>
    )
}

namespace Search {
    export interface Attributes {
        value: any
        submit: (form: AbstractSearch) => void
    }
}

export default Search
