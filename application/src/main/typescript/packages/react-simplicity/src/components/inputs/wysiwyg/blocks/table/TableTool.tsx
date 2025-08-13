import React, {useContext} from "react"
import {findParent} from "../../core/TreeNodes";
import {TableCellNode, TableNode, TableRowNode} from "./TableNode";
import {TextNode} from "../../core/TreeNode";
import {ParagraphNode} from "../paragraph/ParagraphNode";
import OrderNode from "../shared/OrderNode";
import {EditorContext} from "../../contexts/EditorState";

function TableTool(properties: TableTool.Attributes) {

    const {node} = properties

    const {ast: {root, triggerAST}, cursor: {currentCursor, triggerCursor}} = useContext(EditorContext)

    function onAddRowAbove() {
        let tableCell = findParent(currentCursor.container, (node) => node instanceof TableCellNode)
        let tableRow = tableCell.parent

        let tableRowIndex = tableRow.parentIndex

        let tableRowNode = new TableRowNode([]);
        node.insertChild(tableRowIndex, tableRowNode)

        for (let i = 0; i < tableRow.children.length; i++) {
            tableRowNode.appendChild(new TableCellNode([new ParagraphNode([new TextNode("")])]))
        }

        triggerAST()
    }

    function deleteRow() {
        let tableCell = findParent(currentCursor.container, (node) => node instanceof TableCellNode)
        let tableRow = tableCell.parent

        tableRow.remove()

        event.stopPropagation()

        triggerAST()
    }

    function onAddRowBelow() {
        let tableCell = findParent(currentCursor.container, (node) => node instanceof TableCellNode)
        let tableRow = tableCell.parent

        let tableRowIndex = tableRow.parentIndex

        let tableRowNode = new TableRowNode([]);
        node.insertChild(tableRowIndex + 1, tableRowNode)

        for (let i = 0; i < tableRow.children.length; i++) {
            tableRowNode.appendChild(new TableCellNode([new ParagraphNode([new TextNode("")])]))
        }

        triggerAST()
    }

    function onAddColumnLeft() {
        let tableCell = findParent(currentCursor.container, (node) => node instanceof TableCellNode)
        let tableCellIndex = tableCell.parentIndex

        for (const row of node.children) {
            row.insertChild(tableCellIndex, new TableCellNode([new ParagraphNode([new TextNode("")])]))
        }

        event.stopPropagation()

        triggerAST()
    }

    function onDeleteColumn() {
        let tableCell = findParent(currentCursor.container, (node) => node instanceof TableCellNode)
        let tableCellIndex = tableCell.parentIndex

        for (const row of node.children) {
            row.children[tableCellIndex].remove()
        }

        triggerAST()
    }

    function onAddColumnRight() {
        let tableCell = findParent(currentCursor.container, (node) => node instanceof TableCellNode)
        let tableCellIndex = tableCell.parentIndex

        for (const row of node.children) {
            row.insertChild(tableCellIndex + 1, new TableCellNode([new ParagraphNode([new TextNode("")])]))
        }

        triggerAST()
    }


    function onDeleteTable() {
        node.remove()

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
        <div style={{display: "flex", flexDirection: "column"}}>
            <button className={"container"} onClick={onAddRowAbove}><span className={"material-icons"}>add_row_above</span>Row above</button>
            <button className={"container"} onClick={deleteRow}><span className={"material-icons"}>delete</span>Delete row</button>
            <button className={"container"} onClick={onAddRowBelow}><span className={"material-icons"}>add_row_below</span>Row below</button>
            <hr style={{width: "100%"}}/>
            <button className={"container"} onClick={onAddColumnLeft}><span className={"material-icons"}>add_column_left</span>Column left</button>
            <button className={"container"} onClick={onDeleteColumn}><span className={"material-icons"}>delete</span>Delete column</button>
            <button className={"container"} onClick={onAddColumnRight}><span className={"material-icons"}>add_column_right</span>Column right</button>
            <hr style={{width: "100%"}}/>
            <button onClick={onDeleteTable} className={"container"}><span className={"material-icons"}>delete</span>Delete Table</button>
            <button onClick={onAddText} className={"container"}><span className={"material-icons"}>add</span>Add Text</button>
            <hr style={{width: "100%"}}/>
            <OrderNode node={node}/>
        </div>
    )
}

namespace TableTool {
    export interface Attributes {
        node: TableNode
    }
}

export default TableTool