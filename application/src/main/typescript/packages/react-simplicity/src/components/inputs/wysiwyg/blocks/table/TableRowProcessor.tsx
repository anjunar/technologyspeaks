import React, {useEffect, useRef} from "react"
import {TableRowNode} from "./TableNode";
import TableCellProcessor from "./TableCellProcessor";

function TableRowProcessor(properties: TableRowProcessor.Attributes) {

    const {node} = properties

    const trRef = useRef(null);

    useEffect(() => {
        node.dom = trRef.current
    }, [node]);

    return (
        <tr ref={trRef}>
            {
                node.children.map(node => <TableCellProcessor key={node.id} node={node}/>)
            }
        </tr>
    )
}

namespace TableRowProcessor {
    export interface Attributes {
        node : TableRowNode
    }
}

export default TableRowProcessor