import React, {createContext, CSSProperties, useContext, useMemo} from "react"
import Table from "../../lists/table/Table"
import Image from "../../inputs/upload/image/Image";
import ObjectDescriptor from "../../../domain/descriptors/ObjectDescriptor";
import NodeDescriptor from "../../../domain/descriptors/NodeDescriptor";
import CollectionDescriptor from "../../../domain/descriptors/CollectionDescriptor";
import {Temporal, TemporalAccessor, TemporalAmount} from "@js-joda/core";
import Validable from "../../../domain/descriptors/Validable";

const sortable = ["String", "Double", "Float", "Integer", "Long", "LocalDate", "LocalDateTime", "Instant", "Boolean"]

function SchemaTable(properties: SchemaTable.Attributes) {

    const {loader, onRowClick, selectable, name, style, children, limit, initialData} = properties

    const [rows, count, schema] = initialData()

    const [filters, headers, bodies, footers] = useMemo(() => {
        let filters: React.ReactElement[] = []
        let headerChildren: React.ReactElement[] = []
        let consumers: React.ReactElement[] = []
        let footers: React.ReactElement[] = []

        if (children instanceof Array) {
            let filter = children.find(child => child.type === SchemaTable.Filter)
            if (filter) {
                filters = filter.props.children
            }
            const header = children.find(child => child.type === SchemaTable.Head)
            if (header) {
                headerChildren = header.props.children instanceof Array ? header.props.children : [header.props.children]
            }

            const body = children.find(child => child.type === SchemaTable.Body)
            consumers = body.props.children instanceof Array ? body.props.children : [body.props.children]

            const footer = children.find(child => child.type === SchemaTable.Footer)
            if (footer) {
                footers = footer.props.children instanceof Array ? footer.props.children : [footer.props.children]
            }
        }
        return [filters, headerChildren, consumers, footers]
    }, [children]);

    const tableLoader = new (class extends SchemaTable.Loader {
        onLoad(query: any, callback: any) {
            loader.onLoad(query, (rows, index, size, loadedSchema) => {
                    /*
                                        if (schema && loadedSchema) {
                                            if (JSON.stringify(schema) !== JSON.stringify(loadedSchema)) {
                                                setSchema(loadedSchema)
                                            }
                                        } else {
                                            setSchema(loadedSchema)
                                        }
                    */
                    callback(rows, index, size)
                }
            )
        }
    })()

    setTimeout(() => {
        loader.listener = tableLoader.listener
    }, 100)

    const renderCellContent = (object: any, key: string, property: any) => {
        if (property.$type === "CollectionDescriptor") {
            let naming: any[] = [];
            if (property.items.properties) {
                naming = Object.entries(property.items.properties)
                    .filter(([key, node]: [key: string, node: any]) => node.name)
                    .map(([key, node]) => key)
            } else {
                let flatMap = property.items.oneOf.flatMap((item: any) => item.properties);
                // TODO : UGLY!
                naming = Object.entries(flatMap[0])
                    .filter(([key, node]: [key: string, node: any]) => node.name)
                    .map(([key, node]) => key)

            }

            if (object[key]) {
                return object[key]
                    .map((object: any) =>
                        Object.keys(object)
                            .filter(key => naming.indexOf(key) > -1)
                            .map(key => object[key])
                    )
                    .join(" ")
            } else {
                return "no Renderer"
            }
        }

        if (property.$type === "ObjectDescriptor") {
            if (property.widget === "image" && object[key]) {
                return (<Image style={{width: "32px", height: "32px"}} value={object[key]} disabled={true}/>)
            }
            let naming = Object.entries(property.properties || {})
                .filter(([key, node]: [key: string, node: any]) => node.name)
                .map(([key, node]) => key)

            if (object[key]) {
                return Object.entries(object[key])
                    .filter(([key, object]) => {
                        return naming.indexOf(key) > -1
                    })
                    .map(([key1, value]) => {
                        if (value instanceof Temporal) {
                            // @ts-ignore
                            return value.toJSON()
                        }
                        if (value instanceof Object) {
                            return renderCellContent(object[key], key1, property.properties[key1] as NodeDescriptor & Validable)
                        }
                        return value
                    })
                    .join(" ")
            }

            return ""
        }

        let objectElement = object[key]

        if (objectElement instanceof TemporalAmount || objectElement instanceof TemporalAccessor) {
            // @ts-ignore
            return objectElement.toJSON()
        }

        if (typeof objectElement === "boolean") {
            return objectElement ? "true" : "false"
        }

        return objectElement
    }

    return (
        <SchemaTable.SchemaContext.Provider value={schema}>
            <Table className={"table"}
                   loader={tableLoader}
                   initialData={() => [rows, count]}
                   onRowClick={onRowClick}
                   selectable={selectable}
                   autoload={false}
                   name={name}
                   limit={limit}
                   style={style}>
                <Table.Filter>
                    {
                        filters.map(element => (
                            <Table.Filter.Cell>
                                {({row, index, data}: { row: any, index: number, data: any }) => (
                                    <SchemaTable.Filter.FilterCellProvider row={row} index={index} data={data}>
                                        {element}
                                    </SchemaTable.Filter.FilterCellProvider>
                                )}
                            </Table.Filter.Cell>
                        ))
                    }
                </Table.Filter>
                <Table.Head>
                    {
                        headers.map(element => (
                            <Table.Head.Cell property={element.props["property"]}
                                             sortable={sortable.indexOf(((schema?.properties.rows) as CollectionDescriptor)?.items.properties[element.props["property"]].type) > -1}>{element}</Table.Head.Cell>
                        ))
                    }
                </Table.Head>
                <Table.Body>
                    {
                        bodies.map(element => (
                            <Table.Body.Cell>
                                {({row, index}: { row: any, index: number }) => (
                                    <SchemaTable.Body.CellProvider row={row} index={index}>
                                        {element}
                                    </SchemaTable.Body.CellProvider>
                                )}
                            </Table.Body.Cell>
                        ))
                    }
                </Table.Body>
                <Table.Footer>
                    {
                        footers.map(element => (
                            <Table.Footer.Cell>{element}</Table.Footer.Cell>
                        ))
                    }
                </Table.Footer>
            </Table>
        </SchemaTable.SchemaContext.Provider>
    )
}

namespace SchemaTable {
    export const SchemaContext = React.createContext<ObjectDescriptor>(null);

    export interface Attributes {
        loader: Loader
        initialData?: () => [any[], number, ObjectDescriptor]
        onRowClick?: (row: any) => void
        selectable?: boolean
        name?: string
        limit?: number
        style?: CSSProperties
        children?: React.ReactNode
    }

    export abstract class Loader {
        listener: any

        abstract onLoad(query: Query, callback: Callback): void

        fire() {
            if (this.listener) {
                this.listener();
            }
        }
    }

    export interface Query {
        index: number
        limit: number
        filter: { property: string, value: any }
        sort: { property: string, value: "asc" | "desc" | "none" }[]
    }

    export interface Callback {
        (rows: any[], index: number, size: number, schema: ObjectDescriptor): void
    }

    export function Filter({children}: { children: React.ReactElement[] }) {
        return (
            <Table.Filter>{children}</Table.Filter>
        )
    }

    export namespace Filter {
        export const FilterContext = createContext(null);

        export const Cell = FilterContext.Consumer

        export function FilterCellProvider({row, index, data, children}: {
            row: any,
            index: number,
            data: any,
            children: React.ReactElement
        }) {
            return (
                <FilterContext.Provider value={{row, index, data}}>
                    <div>{children}</div>
                </FilterContext.Provider>
            )
        }
    }

    export function Head({children}: { children: React.ReactNode }) {
        return (
            <Table.Head>{children}</Table.Head>
        )
    }

    export namespace Head {
        export function Cell({property}: { property: string }) {

            const context = useContext(SchemaTable.SchemaContext)

            return (
                <Table.Head.Cell sortable={false}>
                    {((context.properties.rows) as CollectionDescriptor).items.properties[property].title}
                </Table.Head.Cell>
            )
        }
    }

    export function Body({children}: { children: React.ReactNode }) {
        return (
            <Table.Body>{children}</Table.Body>
        )
    }

    export namespace Body {
        export const TableContext = createContext<{ row: any, index: number }>(null);

        export const Cell = TableContext.Consumer

        export function CellProvider({row, index, children}: {
            row: any,
            index: number,
            children: React.ReactElement
        }) {
            return (
                <TableContext.Provider value={{row, index}}>
                    {children}
                </TableContext.Provider>
            )
        }
    }

    export function Footer({children}: { children: React.ReactElement }) {
        return (
            <Table.Footer>{children}</Table.Footer>
        )
    }

    export namespace Footer {
        export function Cell({children}: { children: React.ReactElement }) {
            return <div>{children}</div>
        }
    }

}

export default SchemaTable