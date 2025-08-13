import {AbstractCommand} from "../../commands/AbstractCommands";
import {AbstractNode, TextNode} from "../../core/TreeNode";
import {ItemNode, ListNode} from "./ListNode";
import {ParagraphNode} from "../paragraph/ParagraphNode";
import EditorState from "../../contexts/EditorState";

export class ListCommand extends AbstractCommand<AbstractNode> {
    execute(node: AbstractNode, context: EditorState.Context) {
        let parent = node.parent;
        let index = parent.parentIndex
        let grandParent = parent.parent;

        let textNode = new TextNode();
        let listNode = new ListNode([new ItemNode([new ParagraphNode([textNode])],)]);

        if (node instanceof TextNode && node.text) {
            grandParent.insertChild(index + 1, listNode)
        } else {
            parent.remove()
            grandParent.insertChild(index + 1, listNode)
        }

        context.cursor.currentCursor.container = textNode
        context.cursor.currentCursor.offset = 0
        context.cursor.triggerCursor()
    }
}