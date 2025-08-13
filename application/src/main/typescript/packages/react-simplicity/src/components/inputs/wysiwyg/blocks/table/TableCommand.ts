import {AbstractCommand} from "../../commands/AbstractCommands";
import {AbstractNode, TextNode} from "../../core/TreeNode";
import {TableCellNode, TableNode, TableRowNode} from "./TableNode";
import {ParagraphNode} from "../paragraph/ParagraphNode";
import EditorState from "../../contexts/EditorState";

export class TableCommand extends AbstractCommand<AbstractNode> {
    execute(node: AbstractNode, context: EditorState.Context) {

        let parent = node.parent;
        let index = parent.parentIndex
        let grandParent = parent.parent;

        let textNode = new TextNode();

        let tableNode = new TableNode([new TableRowNode([new TableCellNode([new ParagraphNode([textNode])]), new TableCellNode([new ParagraphNode([new TextNode()])])])]);


        if (node instanceof TextNode && node.text) {
            grandParent.insertChild(index + 1, tableNode)
        } else {
            parent.remove()
            grandParent.insertChild(index + 1, tableNode)
        }

        context.cursor.currentCursor.container = textNode
        context.cursor.currentCursor.offset = 0
        context.cursor.triggerCursor()


    }
}