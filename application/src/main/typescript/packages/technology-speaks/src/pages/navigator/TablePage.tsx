import "./TablePage.css"
import React, {useMemo, useState} from "react"
import {AbstractEntity, AbstractSearch, ActiveObject, DateDuration, JSONSerializer, Link, LinkContainerObject, mapTable, match, Router, SchemaTable} from "react-ui-simplicity";
import {process} from "../Root"
import Search from "./Search";
import Loader = SchemaTable.Loader;
import Query = SchemaTable.Query;
import Callback = SchemaTable.Callback;
import navigate = Router.navigate;
import QueryParams = Router.QueryParams;

function TablePage(properties: TableView.Attributes) {

    const {queryParams} = properties

    const [links, setLinks] = useState<LinkContainerObject>({})

    const [search, setSearch] = useState<AbstractSearch>(properties.search)

    const url = "service" + search.$links["list"].url

    const loader = useMemo(() => {
        return new class extends Loader {
            async onLoad(query: Query, callback: Callback) {
                const urlBuilder = new URL(url, window.location.origin)
                let searchParams = urlBuilder.searchParams;

                const index = queryParams["index"] as string || query.index.toString();
                searchParams.set("index", index)
                searchParams.set("limit", query.limit.toString())
                window.history.pushState({}, "", `/navigator/table?index=${query.index}`)

                if (search) {
                    Object.entries(search.$descriptors.properties)
                        .forEach(([key, descriptor]) => {
                            let value = search[key];

                            match(value)
                                .withObject(Array, array => array.forEach((item : any) => searchParams.append(key, item.id)))
                                .withObject(DateDuration, dateDuration => searchParams.append(key, dateDuration.toString()))
                                .withObject(AbstractEntity, (entity : AbstractEntity) => searchParams.append(key, entity.id))
                                .withType("string", value => searchParams.append(key, value.toString()))
                                .nonExhaustive()
                        })
                }

                if (query.filter instanceof Array) {
                    query.filter
                        .filter(filter => filter.value)
                        .forEach(filter => {
                            if (filter.value instanceof Array) {
                                for (const item of filter.value) {
                                    if (item instanceof AbstractEntity) {
                                        searchParams.append(filter.property, item.id)
                                    }
                                }
                            } else {
                                if (filter.value instanceof AbstractEntity) {
                                    searchParams.append(filter.property, filter.value.id)
                                } else {
                                    if (filter.value instanceof DateDuration) {
                                        searchParams.append(filter.property, filter.value.toString())
                                    } else {
                                        searchParams.append(filter.property, filter.value)

                                    }
                                }

                            }
                        })
                }

                if (query.sort instanceof Array) {
                    query.sort
                        .filter(order => order.value && order.value !== "none")
                        .map(order => order.property + ":" + order.value)
                        .forEach(order => searchParams.append("sort", order))
                }

                let response = await fetch(urlBuilder.toString())

                if (response.ok) {
                    let [mapped, size, links, schema] = mapTable(await response.json());
                    setLinks(links || {})
                    callback(mapped, Number.parseInt(index), size, schema)
                } else {
                    process(response)
                }
            }
        }
    }, [search]);

    const onRowClick = (row: any) => {
        let linkModel = Object.values(row.$links as LinkContainerObject).find((link) => link.rel === "read")

        if (linkModel) {
            navigate(`/navigator/form?link=${btoa(linkModel.url)}`)
        }
    }

    function onSearchSubmit(search: AbstractSearch) {
        setSearch(search)
        loader.fire()
    }

    return (
        <div>
            <div>
                {url}
                <br/>
                {Object.values(links).map(link => (
                    <Link
                        style={{margin: "5px"}}
                        key={link.rel}
                        value={`/navigator/${link.linkType}?link=${btoa(link.url)}`}
                    >
                        {link.title}
                    </Link>
                ))}
            </div>
            <Search value={search} submit={onSearchSubmit}/>
            <div style={{overflow: "auto", width: "100%"}}>
                <SchemaTable loader={loader} onRowClick={(row: any) => onRowClick(row)}/>
            </div>
        </div>
    )
}

namespace TableView {
    export interface Attributes {
        queryParams: QueryParams
        search : AbstractSearch
    }
}

export default TablePage