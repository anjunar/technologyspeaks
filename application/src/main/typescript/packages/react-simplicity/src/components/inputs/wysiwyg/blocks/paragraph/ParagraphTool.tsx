import React, {useContext} from "react"
import {ParagraphNode} from "./ParagraphNode";
import OrderNode from "../shared/OrderNode";
import {TextNode} from "../../core/TreeNode";
import {EditorContext} from "../../contexts/EditorState";
import {findNearestTextRight} from "../../utils/ProcessorUtils";

function ParagraphTool(properties: ParagraphTool.Attributes) {

    const {node} = properties

    const {ast: {root, triggerAST}, cursor: {currentCursor}} = useContext(EditorContext)

    function onDeleteParagraph() {
        let textRight = findNearestTextRight(root, node) as TextNode;

        if (textRight) {
            currentCursor.container = textRight
            currentCursor.offset = textRight.text.length
            node.remove()
            triggerAST()
        }
    }

    return (
        <div>
            <button disabled={!findNearestTextRight(root, node)} onClick={onDeleteParagraph} className={"container"}><span className={"material-icons"}>delete</span>Delete Paragraph</button>
            <hr style={{width: "100%"}}/>
            <OrderNode node={node}/>
        </div>
    )
}

namespace ParagraphTool {
    export interface Attributes {
        node: ParagraphNode
    }
}

export default ParagraphTool