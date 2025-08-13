import React from 'react';
import {Link, mapTable, Router, Table} from "react-ui-simplicity";
import Revision from "../../../../domain/document/Revision";
import SchemaTable from "react-ui-simplicity/src/components/meta/table/SchemaTable";
import {process} from "../../../Root";
import navigate = Router.navigate;
import onLink = Link.onLink;

export function RevisionsTablePage(properties: RevisionsTablePage.Attributes) {

    const {pathParams} = properties

    const tableLoader = new (class extends SchemaTable.Loader {
        async onLoad(query: any, callback: any) {

            const response = await fetch(`/service/documents/document/${pathParams["id"]}/revisions?${query.index}&limit=${query.limit}`)

            if (response.ok) {
                const [rows, count] = mapTable(await response.json())
                callback(rows, count)
            } else {
                process(response)
            }

        }
    })()

    function onRowClick(revision: Revision) {
        navigate(`documents/search/${revision.id}?rev=${revision.revision}`)
    }

    return (
        <div className={"center-horizontal"}>
            <div style={{width: "800px"}}>
                <Table className={"table"}
                       loader={tableLoader}
                       style={{width: "100%"}}>
                    <Table.Head>
                        <Table.Head.Cell sortable={true}>
                            Title
                        </Table.Head.Cell>
                        <Table.Head.Cell sortable={true}>
                            Revision
                        </Table.Head.Cell>
                        <Table.Head.Cell sortable={false}>
                            Actions
                        </Table.Head.Cell>
                    </Table.Head>
                    <Table.Body>
                        <Table.Body.Cell>
                            {({row, index}: { row: Revision, index: number }) => <div>{row.title}</div>}
                        </Table.Body.Cell>
                        <Table.Body.Cell>
                            {({row, index}: { row: Revision, index: number }) => <div>{row.revision}</div>}
                        </Table.Body.Cell>
                        <Table.Body.Cell>
                            {({row, index}: { row: Revision, index: number }) => (
                                <div style={{display : "flex", gap : "12px"}}>
                                    {
                                        onLink(row.$links, "viewRevision", link => (
                                            <Link value={link.url}>{link.title}</Link>
                                        ))
                                    }
                                    {
                                        onLink(row.$links, "compareRevision", link => (
                                            <Link value={link.url}>{link.title}</Link>
                                        ))
                                    }
                                </div>
                            )}
                        </Table.Body.Cell>
                    </Table.Body>
                </Table>
            </div>
        </div>
    )
}

namespace RevisionsTablePage {
    import PathParams = Router.PathParams;

    export interface Attributes {
        pathParams: PathParams
    }
}

export default RevisionsTablePage