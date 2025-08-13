    import "./DocumentSearchPage.css"
import React, {useContext} from "react"
import {
    Button,
    format,
    Link,
    LinkContainerObject,
    List,
    mapTable,
    ObjectDescriptor,
    Pageable,
    Router,
    SchemaForm,
    SchemaInput,
    useForm
} from "react-ui-simplicity";
import {process} from "../../Root";
import Document from "../../../domain/document/Document";
import DocumentSearch from "../../../domain/document/DocumentSearch";
import {SystemContext} from "react-ui-simplicity/src/System";
import onLink = Link.onLink;

function DocumentSearchPage(properties: SearchPageMobile.Attributes) {

    const {queryParams, table: [rows, count, links, schema]} = properties

    const search = useForm(properties.search);

    const {info} = useContext(SystemContext)

    const loader = new class extends Pageable.Loader {
        async onLoad(query: Pageable.Query, callback: Pageable.Callback) {
            const searchParamsRead = new URLSearchParams(window.location.search)

            const urlBuilder = new URL("/service/documents", window.location.origin)
            const searchParams = urlBuilder.searchParams;

            let index = searchParamsRead.get("index")
            let limit = searchParamsRead.get("limit")

            searchParams.set("index", index)
            searchParams.set("limit", limit)

            if (search.text) {
                searchParams.set("text", search.text)
                searchParams.set("sort", "score:asc")
            }

            const response = await fetch(urlBuilder.toString())

            if (response.ok) {
                let [mapped, size, links] = mapTable(await response.json());
                callback(mapped, Number.parseInt(index), size)
            } else {
                process(response)
            }
        }
    }

    function onSubmit(name: string, form: any) {
        loader.fire()
    }

    function footer() {
        function range(start, end, step = 1) {
            const result = [];
            for (let i = start; i < end; i += step) {
                result.push(i);
            }
            return result;
        }

        const searchParams = new URLSearchParams(info.search)
        let limit = Number.parseInt(searchParams.get("limit"));
        let index = Number.parseInt(searchParams.get("index"));

        return (
            <div style={{display: "flex", gap: "12px", alignItems: "center"}}>
                <span>{index}</span>
                <span>-</span>
                <span>{index + limit}</span>
                <span>of</span>
                <span>{count}</span>
                <span>Pages: </span>
                {
                    range(0, count, limit).map((i) => {
                        searchParams.set("index", (i).toString())
                        return <a key={i} href={`${info.path}?${searchParams.toString()}`}>{i / 5}</a>
                    })
                }
            </div>
        )
    }

    return (
        <div className={"search-page"}>
            <div className={"center-horizontal"}>
                <div style={{display: "flex", flexWrap: "wrap-reverse", gap: "24px", alignItems: "baseline"}}>
                    <div>
                        <div style={{minWidth: "360px", maxWidth: "800px", width: "100%"}}>
                            {
                                rows.map((row, index) => (
                                    <a key={row.id} href={row.$links["read"].url}>
                                        <div className={"selected"}>
                                            <div style={{
                                                display: "flex",
                                                alignItems: "baseline",
                                                justifyContent: "space-between",
                                                gap: "12px"
                                            }}>
                                                <div style={{display: "flex", alignItems: "baseline", gap: "12px"}}>
                                                    <h2 style={{color: "var(--color-selected)"}}>{row.title}</h2>
                                                    <small>{row.score}</small>
                                                </div>
                                                <small>{row.user.nickName}: {format(row.created, "dd.MM.yyyy HH:mm")}</small>
                                            </div>
                                            <p>{row.description}</p>
                                        </div>
                                    </a>
                                ))
                            }
                        </div>
                        <div>
                            {
                                footer()
                            }
                        </div>
                    </div>
                    <div className={"search-box"} style={{minWidth: "360px", maxWidth: "800px"}}>
                        <div>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "12px"
                            }}>
                                <h2>Search</h2>
                                {
                                    onLink(links, "create", (link) => (
                                        <Link key={link.url} value={link.url} className={"material-icons"}>
                                            edit_note
                                        </Link>
                                    ))
                                }
                            </div>
                            <SchemaForm value={search} onSubmit={onSubmit}>
                                <SchemaInput name={"text"}/>
                                <input type={"hidden"} name={"index"} value={"0"}/>
                                <input type={"hidden"} name={"limit"} value={"5"}/>
                                <input type={"hidden"} name={"sort"} value={"score:asc"}/>
                                <div style={{display: "flex", justifyContent: "flex-end"}}>
                                    {
                                        onLink(links, "search", (link) => (
                                            <Button name={"search"}>{link.title}</Button>
                                        ))
                                    }
                                </div>
                            </SchemaForm>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

namespace SearchPageMobile {
    export interface Attributes {
        queryParams: Router.QueryParams
        search: DocumentSearch
        table: [Document[], number, LinkContainerObject, ObjectDescriptor]
    }
}

export default DocumentSearchPage