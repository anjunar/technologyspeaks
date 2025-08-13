import React, {useContext} from "react"
import {CodeNode} from "./CodeNode";
import {EditorContext} from "../../contexts/EditorState";
import OrderNode from "../shared/OrderNode";
import {findNode} from "../../core/TreeNodes";
import {TextNode} from "../../core/TreeNode";
import {TokenNode} from "./TokenNode";
import {ParagraphNode} from "../paragraph/ParagraphNode";

function CodeTool(properties: CodeTool.Attributes) {

    const {node} = properties

    const {ast : {triggerAST}, cursor : {currentCursor, triggerCursor}} = useContext(EditorContext)

    function onDelete() {
        let parentIndex = node.parentIndex;
        let parent = node.parent;

        node.remove()

        let child = parent.children[parentIndex === 0 ? 0 : parentIndex - 1];
        let textNode = findNode(child, node => node instanceof TextNode || node instanceof TokenNode);

        currentCursor.container = textNode
        currentCursor.offset = 0

        triggerCursor()
        triggerAST()
    }

    function onAddText() {
        let textNode = new TextNode("");
        node.after(new ParagraphNode([textNode]))

        currentCursor.container = textNode
        currentCursor.offset = 0

        triggerCursor()
        triggerAST()
    }

    return (
        <div>
            <button onClick={onDelete} className={"container"}><span className={"material-icons"}>delete</span>Delete Code</button>
            <button onClick={onAddText} className={"container"}><span className={"material-icons"}>add</span>Add Text</button>
            <hr style={{width: "100%"}}/>
            <OrderNode node={node}/>
        </div>
    )
}

namespace CodeTool {
    export interface Attributes {
        node : CodeNode
    }
}

export default CodeTool