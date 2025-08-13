import React, {useContext} from "react"
import {AbstractNode} from "../../core/TreeNode";
import {EditorContext} from "../../contexts/EditorState";

function OrderNode(properties: OrderNode.Attributes) {

    const {node} = properties

    const {ast: {root, triggerAST}} = useContext(EditorContext)

    function moveUp() {
        let parent = node.parent;
        let parentIndex = node.parentIndex;

        parent.insertChild(parentIndex - 1, node)

        triggerAST()
    }

    function moveDown() {
        let parent = node.parent;
        let parentIndex = node.parentIndex;

        parent.insertChild(parentIndex + 1, node)

        triggerAST()
    }

    return (
        <div style={{display : "flex", flexDirection : "column"}}>
            <button onClick={moveUp} disabled={! node.prevSibling} className={"container"}><span className={"material-icons"}>arrow_upward</span>Move up</button>
            <button onClick={moveDown} disabled={! node.nextSibling} className={"container"}><span className={"material-icons"}>arrow_downward</span>Move down</button>
        </div>
    )
}

namespace OrderNode {
    export interface Attributes {
        node : AbstractNode
    }
}

export default OrderNode