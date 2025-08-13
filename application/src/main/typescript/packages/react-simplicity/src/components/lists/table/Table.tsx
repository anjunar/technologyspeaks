import "./Table.css"
import React, {createContext, CSSProperties, useContext, useEffect, useLayoutEffect, useMemo, useState} from "react"
import withPageable from "../../shared/Pageable"
import Input from "../../inputs/input/Input";
import {FormContext} from "../../inputs/form/Form";
import {v4} from "uuid";
import loader from "ts-loader";
import Pageable from "../../shared/Pageable";
import SchemaTable from "../../meta/table/SchemaTable";

function TableRenderer(properties: TableRenderer.Attributes) {

    const {
        index,
        name,
        value,
        onChange,
        className,
        children,
        window,
        load,
        loader,
        limit,
        size,
        selectable,
        showHeader = true,
        showPagination = true,
        onRowClick,
        skipPrevious,
        arrowLeft,
        arrowRight,
        skipNext,
        ...rest
    } = properties

    let state = value

    const [filterCells, headerCells, bodyCells, footerCells] = useMemo(() => {
        let filters: React.ReactElement[] = []
        let headerChildren: React.ReactElement[] = []
        let consumers: React.ReactElement[] = []
        let footers: React.ReactElement[] = []

        if (children instanceof Array) {
            let filter = children.find(child => child.type === Table.Filter)
            if (filter) {
                filters = filter.props.children
            }
            const header = children.find(child => child.type === Table.Head)
            if (header) {
                headerChildren = header.props.children instanceof Array ? header.props.children : [header.props.children]
            }

            const body = children.find(child => child.type === Table.Body)
            consumers = body.props.children instanceof Array ? body.props.children : [body.props.children]

            const footer = children.find(child => child.type === Table.Footer)
            if (footer) {
                footers = footer.props.children instanceof Array ? footer.props.children : [footer.props.children]
            }
        }
        return [filters, headerChildren, consumers, footers]
    }, [children]);


    const formContext = useContext(FormContext)

    if (formContext) {
        state = formContext.value[name]
    }

    const [open, setOpen] = useState(false)

    const model = useMemo(() => {
        if (formContext && name) {
            return formContext.value[name] || []
        }
        return []
    }, [])

    const [columns, setColumns] = useState(() => {
        return generateColumnData()
    })

    const [filterData, setFilterData] = useState(() => {
        return generateFilterData()
    })

    const rowClick = (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>, row: any) => {
        if (onRowClick) {
            onRowClick(row)
        }
    }

    function generateColumnData() {
        return headerCells.map((child: React.ReactElement, index) => {
            return {
                index: index,
                // @ts-ignore
                property: child.props.property,
                visible: true,
                // @ts-ignore
                sort: child.props.sortable ? "none" : null,
                element: child
            }
        })
    }

    function generateFilterData() {
        return headerCells.map((child, index) => {

            return {
                index: index,
                // @ts-ignore
                property: child.props.property,
                element: child,
                value: undefined,
                change(value: any) {
                    this.value = value
                }
            }
        })
    }


    useLayoutEffect(() => {
        setColumns(generateColumnData())
        setFilterData(generateFilterData())
    }, [headerCells.length])

    function getBodyCell(row: any, index: number, rowIndex: number, property: string) {
        let consumer = bodyCells[index]
        return (
            <Table.Body.CellProvider key={property} row={row} index={rowIndex}>
                {consumer}
            </Table.Body.CellProvider>
        )
    }

    function getBodyRow(row: any, rowIndex: number) {

        const onChangeHandler = (event: any) => {
            if (event) {
                if (state.findIndex((item: any) => item.id === row.id) === -1) {
                    state.push(row)
                }
            } else {
                let indexOf = state.findIndex((item: any) => item.id === row.id)
                if (indexOf > -1) {
                    state.splice(indexOf, 1)
                }
            }
        }

        let elements = columns
            .filter(column => column.visible)
            .map(column => getBodyCell(row, column.index, rowIndex, column.property))

        function getValue() {
            return state.findIndex((item: any) => {
                return item.id === row.id
            }) > -1;
        }

        return (
            <tr key={row.id} onClick={event => rowClick(event, row)}>

                {
                    selectable ? (
                        <td key={"select"} style={{width: "12px", verticalAlign : "middle"}}>
                            <Input type={"checkbox"} value={getValue()} onChange={onChangeHandler} standalone={true}/>
                        </td>
                    ) : ""
                }

                {elements}
            </tr>
        )
    }

    const onSearch = () => {
        let queries = filterData.map(item => ({property: item.property, value: item.value})).filter(item => item.value) as any[];
        let sort = columns.map(column => ({property: column.property, value: column.sort})).filter(column => column.value)
        load({index: index, limit: limit, filter: queries, sort: sort}, () => {})
    }

    const onConfigClick = () => {
        setOpen(!open)
    }

    const desc = (td: any) => {
        let column = columns[td.index]
        column.sort = "desc"
        td.sort = "desc"
        onSearch()
    }

    const asc = (td: any) => {
        let column = columns[td.index]
        column.sort = "asc"
        td.sort = "asc"
        onSearch()
    }

    const none = (td: any) => {
        let column = columns[td.index]
        column.sort = "none"
        td.sort = "none"
        onSearch()
    }

    function getHeaderCell(cell: any) {
        return (
            <td key={v4()}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    <div onClick={onConfigClick}>{cell.element}</div>
                    <button
                        style={{display: cell.sort === "none" ? "block" : "none"}}
                        className="material-icons"
                        translate="no"
                        onClick={() => asc(cell)}
                    >
                        sort
                    </button>
                    <button
                        style={{display: cell.sort === "asc" ? "block" : "none"}}
                        className="material-icons"
                        translate="no"
                        onClick={() => desc(cell)}
                    >
                        expand_more
                    </button>
                    <button
                        style={{display: cell.sort === "desc" ? "block" : "none"}}
                        className="material-icons"
                        translate="no"
                        onClick={() => none(cell)}
                    >
                        expand_less
                    </button>
                </div>
            </td>
        )
    }

    const portal = () => {
/*
        let service = appContext.service?.viewPort.current
        if (service) {
            return open
                ? createPortal(
                    <Window resizable={false} centered>
                        <WindowHeader>
                            <div style={{display: "flex", width: "100%"}}>
                                <div style={{flex: 1}}>Table Configuration</div>
                                <button
                                    type="button"
                                    className="material-icons"
                                    onClick={() => setOpen(false)}
                                >
                                    close
                                </button>
                            </div>
                        </WindowHeader>
                        <Content>
                            <Configuration columns={columns} setColumns={setColumns} filters={filters}
                                           filterData={filterData} onSearch={onSearch}/>
                        </Content>
                    </Window>,
                    service
                )
                : ""
        }
*/
    }

    useEffect(() => {
        loader.listener = () => {
            onSearch()
        }
    }, [loader, columns, filterData]);

    return (
        <table className={className} {...rest}>
            {
                showHeader ? (
                    <thead>
                    <tr>
                        {
                            selectable ? (
                                <td>
                                    <div style={{marginTop: "4px"}}>Auswahl</div>
                                </td>
                            ) : ""
                        }
                        {columns
                            .filter(cell => cell.visible)
                            .map(cell => getHeaderCell(cell))}
                    </tr>
                    </thead>
                ) : ""
            }
            <tbody>
            {window.map((row, rowIndex) => getBodyRow(row, rowIndex))}
            </tbody>
            {
                showPagination && (
                    <tfoot>
                    <tr>
                        <td colSpan={columns.length}>
                            {
                                (limit > -1) && (<div style={{display: "flex", alignItems: "center", height: "50px"}}>
                                    <button onClick={skipPrevious} className="material-icons">
                                        skip_previous
                                    </button>
                                    <button
                                        onClick={arrowLeft}
                                        className="material-icons"
                                        disabled={!(index > 0)}
                                    >
                                        keyboard_arrow_left
                                    </button>
                                    <button
                                        onClick={arrowRight}
                                        className="material-icons"
                                        disabled={!(index + limit < size)}
                                    >
                                        keyboard_arrow_right
                                    </button>
                                    <button onClick={skipNext} className="material-icons">
                                        skip_next
                                    </button>
                                    <span style={{marginLeft: "12px"}}>{index} - {index + limit} of {size}</span>
                                </div>)
                            }
                        </td>
                        {
                            footerCells.length > 0 && (
                                <td style={{verticalAlign: "middle"}}>
                                    {footerCells}
                                </td>
                            )
                        }
                    </tr>
                    </tfoot>
                )
            }
        </table>
    )
}


function Table(properties: Table.Attributes) {
    return withPageable(TableRenderer, properties)()
}

namespace Table {
    export interface Attributes {
        className?: string
        autoload?: boolean
        onRowClick?: any
        dynamicWidth? : boolean
        loader: Pageable.Loader
        initialData? : () => [any[], number]
        limit?: number
        children: React.ReactNode
        value?: any[]
        onChange?: (value: any[]) => void
        selectable?: boolean
        showHeader?: boolean
        showPagination?: boolean
        name?: string
        style?: CSSProperties
    }

    export function Filter({children} : { children : React.ReactElement[]}) {
        return (
            <div>
                {children}
            </div>
        )
    }

    export namespace Filter {
        export const FilterContext = createContext(null);

        export const Cell = FilterContext.Consumer

        export function FilterCellProvider({ row, index, data, children }  : { row : any, index : number, data : any, children : React.ReactElement}) {
            return (
                <FilterContext.Provider value={{ row, index, data }}>
                    <div>{children}</div>
                </FilterContext.Provider>
            )
        }
    }

    export function Head({ children } : { children : React.ReactNode}) {
        return (
            <thead>
            <tr>{children}</tr>
            </thead>
        )
    }

    export namespace Head {
        export function Cell({ children, property, sortable  } : { children : React.ReactNode, property? : string, sortable : boolean}) {
            return <div>{children}</div>
        }
    }

    export function Body({ children } : { children : React.ReactNode}) {
        return (
            <tbody>
            <tr>{children}</tr>
            </tbody>
        )
    }

    export namespace Body {
        export const TableContext = createContext<{row : any, index : number}>(null);

        export const Cell = TableContext.Consumer

        export function CellProvider({ row, index, children }  : { row : any, index : number, children : React.ReactElement}) {
            return (
                <TableContext.Provider value={{ row, index }}>
                    <td>{children}</td>
                </TableContext.Provider>
            )
        }
    }

    export function Footer({children} : { children : React.ReactNode}) {
        return (
            <div>
                {children}
            </div>
        )
    }

    export namespace Footer {
        export function Cell({ children }  : { children : React.ReactNode}) {
            return <div>{children}</div>
        }
    }


}

namespace TableRenderer {
    export interface Attributes {
        className: string
        children: React.ReactElement
        window: any[]
        load: any
        loader : Pageable.Loader
        initialData? : () => [any[], number]
        index: number
        limit: number
        size: number
        selectable: boolean
        showHeader: boolean
        showPagination: boolean
        name: string
        value: any[],
        onChange: (value: any[]) => void
        onRowClick: any
        skipPrevious: React.MouseEventHandler<HTMLButtonElement>
        arrowLeft: any
        arrowRight: any
        skipNext: React.MouseEventHandler<HTMLButtonElement>
    }
}

export default Table