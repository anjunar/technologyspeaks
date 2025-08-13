import React, {useEffect, useRef} from "react"
import {TableCellNode} from "./TableNode";
import ProcessorFactory from "../shared/ProcessorFactory";

function TableCellProcessor(properties: TableCellProcessor.Attributes) {

    const {node} = properties

    const tdRef = useRef(null);

    useEffect(() => {
        node.dom = tdRef.current
    }, [node])

    return (
        <td ref={tdRef}>
            {
                node.children.map(node => <ProcessorFactory key={node.id} node={node}/>)
            }
        </td>
    )
}

namespace TableCellProcessor {
    export interface Attributes {
        node : TableCellNode
    }
}

export default TableCellProcessor
