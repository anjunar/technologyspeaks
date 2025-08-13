import React, {useContext} from "react"
import {ItemNode, ListNode} from "./ListNode";
import {TextNode} from "../../core/TreeNode";
import {findParent} from "../../core/TreeNodes";
import {ParagraphNode} from "../paragraph/ParagraphNode";
import OrderNode from "../shared/OrderNode";
import {EditorContext} from "../../contexts/EditorState";

function ListTool(properties: ListTool.Attributes) {

    const {node} = properties

    const {ast: {root, triggerAST}, cursor: {currentCursor, triggerCursor}} = useContext(EditorContext)


    function addClick() {
        let liNode = findParent(currentCursor.container, element => element instanceof ItemNode && element.parent === node) as ItemNode

        let parent = liNode.parent;
        let parentIndex = liNode.parentIndex;

        let textNode = new TextNode();

        let firstChild = (liNode.children[0] as ParagraphNode).children[0] as TextNode
        if (firstChild.text === "") {
            let grandParent = parent.parent;
            let grandParentIndex = parent.parentIndex;
            liNode.remove()
            grandParent.insertChild(grandParentIndex + 1, new ParagraphNode([textNode]));
        } else {
            parent.insertChild(parentIndex + 1, new ItemNode([new ParagraphNode([textNode])]));
        }

        currentCursor.container = textNode
        currentCursor.offset = 0

        triggerCursor()
        triggerAST()
    }

    function deleteClick() {

        let liNode = findParent(currentCursor.container, element => element instanceof ItemNode && element.parent === node) as ItemNode

        let parent = liNode.parent;

        liNode.remove()

        if (parent.children.length === 0) {
            parent.remove()
        }

        triggerAST()
    }

    function onDeleteList() {
        node.remove()

        triggerAST()
    }

    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <button onClick={addClick} className={"container"}><span className={"material-icons"}>add</span>Add item</button>
            <button onClick={deleteClick} className={"container"}><span className={"material-icons"}>delete</span>Delete item</button>
            <hr style={{width: "100%"}}/>
            <button onClick={onDeleteList} className={"container"}><span className={"material-icons"}>delete</span>Delete List</button>
            <hr style={{width: "100%"}}/>
            <OrderNode node={node}/>
        </div>
    )
}

namespace ListTool {
    export interface Attributes {
        node: ListNode
    }
}

export default ListTool
