import React, {useLayoutEffect} from "react"
import Table from "./Table"
import Pageable from "../../shared/Pageable";
import Input from "../../inputs/input/Input";

function Configuration(properties : Configuration.Attributes) {

    const {columns, onSearch , filters,filterData, setColumns} = properties

    const loader = new (class extends Pageable.Loader {
        onLoad(query : Pageable.Query, callback : Pageable.Callback) {
            let rows = columns.slice(query.index, query.index + query.limit)
            callback(rows, columns.length)
        }
    })()

    const onChangeHandler = (row : any) => {
        row.visible = !row.visible
        let newVar = [...columns]
        setColumns(newVar)
    }

    const left = (index : number) => {
        let element = columns[index]
        let other = columns[index - 1]

        let newColumns = Array.from(columns)
        newColumns[index] = other
        newColumns[index - 1] = element

        setColumns(newColumns)
    }

    const right = (index : number) => {
        let element = columns[index]
        let other = columns[index + 1]

        let newColumns = Array.from(columns)

        newColumns[index] = other
        newColumns[index + 1] = element

        setColumns(newColumns)
    }

    useLayoutEffect(() => {
        loader.fire()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columns])

    function getFilterCell(index : number, row : any) {
        let filter = filters[index];
        return (
            <div>
                <Table.Filter.FilterCellProvider index={index} row={row} data={filterData[index]}>
                    {filter}
                </Table.Filter.FilterCellProvider>
            </div>
        )
    }

    return (
        <div>
            <Table loader={loader}>
                <Table.Head>
                    <Table.Head.Cell property="children">Property</Table.Head.Cell>
                    <Table.Head.Cell property="visible">Visibility</Table.Head.Cell>
                    <Table.Head.Cell property="filter">Filter</Table.Head.Cell>
                    <Table.Head.Cell computed={true}>Order</Table.Head.Cell>
                </Table.Head>
                <Table.Body>
                    <Table.Body.Cell>{({row, index}) => <div>{row.element}</div>}</Table.Body.Cell>
                    <Table.Body.Cell>
                        {({row, index}) => (
                            <Input type={"checkbox"} value={row.visible} onChange={() => onChangeHandler(row)}/>
                        )}
                    </Table.Body.Cell>
                    <Table.Body.Cell>
                        {({row, index}) => getFilterCell(row.index, row)}
                    </Table.Body.Cell>
                    <Table.Body.Cell>
                        {({row, index}) => (
                            <div>
                                <button
                                    disabled={index === 0}
                                    className="material-icons"
                                    onClick={() => left(index)}
                                >
                                    chevron_left
                                </button>
                                <button className="material-icons" onClick={() => right(index)}>
                                    chevron_right
                                </button>
                            </div>
                        )}
                    </Table.Body.Cell>
                </Table.Body>
                <Table.Footer>
                    <Table.Footer.Cell>
                        <div style={{textAlign : "right"}}>
                            <button style={{marginRight : "8px"}} className={"material-icons"} type={"button"} onClick={onSearch}>search</button>
                        </div>
                    </Table.Footer.Cell>
                </Table.Footer>
            </Table>

        </div>
    )
}

namespace Configuration {
    export interface Attributes {
        columns : any
        setColumns : React.Dispatch<any>
        filters : any
        filterData : any
        onSearch : any
    }
}

export default Configuration