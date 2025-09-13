import "./HomePage.css"
import React from "react"
import DocumentSearch from "../../domain/document/DocumentSearch";
import {AutoSuggest, Button, Form, FormModel, Link, mapTable, Router, SchemaForm, useForm} from "shared";
import HashTag from "../../domain/shared/HashTag";
import {process} from "../Root"
import navigate = Router.navigate;
import onLink = Link.onLink;

function HomePage(properties: HomePage.Attributes) {

    const {} = properties

    let search = useForm(properties.search);

    function onSearch(event : React.KeyboardEvent) {
        if (event.key === "Enter") {
            navigate(`documents/search?text=${encodeURIComponent(search.text) || ""}&index=0&limit=5&sort=score:asc`)
        }
    }

    async function loader(query : AutoSuggest.Query, callback : AutoSuggest.Callback) {

        const beforeCursor = query.value.slice(0, query.cursorPos);
        const match = beforeCursor.match(/#(\w*)$/);

        if (match) {
            let value = match[1]

            let url = `/service/documents/document/hashtags?value=${value}&index=${query.index}&limit=${query.limit}`;

            const response = await fetch(url)

            if (response.ok) {
                let [rows, count] = mapTable(await response.json());
                callback(rows, count)
            } else {
                process(response)
            }
        } else {
            callback([], 0)
        }
    }



    function onSelection(hashTag : HashTag, cursorPos : number) : number {
        const text = search.text

        const beforeCursor = text.slice(0, cursorPos);
        const match = beforeCursor.match(/#(\w*)$/);

        const before = text.slice(0, cursorPos - match[0].length);
        const after = text.slice(cursorPos);
        search.text = before + hashTag.value + ' ' + after

        return before.length + hashTag.value.length + 1;
    }

    function onSubmit(name : string, form : FormModel) {

    }

    return (
        <div className={"home-page"}>
            <div className={"center"}>
                <div style={{display : "flex", justifyContent : "stretch", flexDirection : "column"}}>
                    <div style={{display : "flex", alignItems : "center", gap : "12px", fontSize : "8vw"}}>
                        <img src={"/static/assets/logo.png"} style={{width : "1em"}}/>
                        <h1 style={{fontSize : "1em", margin : 0, padding : 0, color : "white"}}>Technology Speaks</h1>
                    </div>
                    <SchemaForm onSubmit={onSubmit} value={search} style={{marginTop : "12px", display : "flex", justifyContent : "stretch", flexDirection : "column"}}>
                        <input type={"hidden"} name={"index"} value={"0"}/>
                        <input type={"hidden"} name={"limit"} value={"5"}/>
                        <input type={"hidden"} name={"sort"} value={"score:asc"}/>
                        <AutoSuggest loader={loader}
                                     name={"text"}
                                     onKeyUp={onSearch}
                                     placeholder={"Search with natural language"}
                                     onSelection={onSelection}
                                     style={{backgroundColor : "var(--color-background-primary)", flex : 1, padding : "12px"}}>
                            {
                                (row : HashTag) => (
                                    <p>{row.value}</p>
                                )
                            }
                        </AutoSuggest>
                        <br/>
                        <div style={{display : "flex", justifyContent : "flex-end"}}>
                            {
                                onLink(search.$links, "list", link => (
                                    <Button style={{backgroundColor : "var(--color-background-primary)"}} type={"submit"} className={"large hover"}>{link.title}</Button>
                                ))
                            }
                        </div>
                    </SchemaForm>
                </div>
            </div>
        </div>
    )
}

namespace HomePage {
    export interface Attributes {
        search : DocumentSearch
    }
}

export default HomePage