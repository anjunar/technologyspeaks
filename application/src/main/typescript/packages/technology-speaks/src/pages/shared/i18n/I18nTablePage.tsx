import React, {useState} from 'react';
import I18nSearch from "../../../domain/shared/i18n/I18nSearch";
import {
    Button, CollectionDescriptor,
    Link,
    LinkContainerObject,
    mapTable, ObjectDescriptor,
    Router,
    SchemaForm,
    SchemaInput,
    SchemaTable, TableObject,
    useForm
} from "react-ui-simplicity";
import {process} from "../../Root";
import I18n from "../../../domain/shared/i18n/I18n";
import navigate = Router.navigate;
import onLink = Link.onLink;

export function I18nTablePage(properties: I18nTablePage.Attributes) {

    const {queryParams, search, table : [rows, count, links, schema]} = properties

    const domain = useForm(search);

    function onRowClick(i18n: I18n) {
        let link = i18n.$links?.["read"]
        if (link) {
            navigate(link.url)
        }
    }

    return (
        <div className={"i18n-table-page"}>
            <div className={"center-horizontal"}>
                <div className={"responsive-column"}>
                    <SchemaForm value={domain} onSubmit={null}>
                        <SchemaInput name={"text"}/>
                        <div style={{display : "flex", justifyContent : "flex-end"}}>
                            {
                                onLink(links, "search", (link) => (
                                    <Button name={"search"}>{link.title}</Button>
                                ))
                            }
                        </div>
                    </SchemaForm>
                    <table className={"table"} style={{width : "100%"}}>
                        <tbody>
                            {
                                rows.map((row, index) => (
                                    <tr key={row.id} onClick={() => onRowClick(row)}>
                                        <td style={{width : "50%"}}>{row.text}</td>
                                        <td style={{width : "50%"}}>{row.translations.map(translation => <p>{translation.locale + ": " + translation.text}</p>)}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

namespace I18nTablePage {
    export interface Attributes {
        queryParams: Router.QueryParams
        search : I18nSearch
        table : [I18n[], number, LinkContainerObject, ObjectDescriptor]
    }
}

export default I18nTablePage;