import React, {useEffect, useRef} from "react"
import {ItemNode, ListNode} from "./ListNode";
import ListItemProcessor from "./ListItemProcessor";

function ListProcessor(properties: ListProcessor.Attributes) {

    const {node} = properties

    const ulRef = useRef(null)

    useEffect(() => {
        node.dom = ulRef.current
    }, [node]);



    return (
        <ul ref={ulRef}>
            {node.children.map(child => <ListItemProcessor key={child.id} node={child as ItemNode}/>)}
        </ul>
    )
}

namespace ListProcessor {
    export interface Attributes {
        node : ListNode
    }
}

export default ListProcessor
