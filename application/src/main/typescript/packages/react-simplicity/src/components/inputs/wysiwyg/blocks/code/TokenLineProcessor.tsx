import React, {useEffect, useRef} from "react"
import {TokenLineNode} from "./TokenLineNode";
import TokenProcessor from "./TokenProcessor";

function TokenLineProcessor(properties: TokenLineProcessor.Attributes) {

    const {node} = properties

    const divRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        node.dom = divRef.current
    }, [node]);

    return (
        <div ref={divRef}>
            {
                node.children.map(node => <TokenProcessor key={node.id} node={node}/>)
            }
        </div>
    )
}

namespace TokenLineProcessor {
    export interface Attributes {
        node : TokenLineNode
    }
}

export default TokenLineProcessor
