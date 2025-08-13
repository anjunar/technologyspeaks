import {AbstractCommand} from "../../commands/AbstractCommands";
import {AbstractNode, TextNode} from "../../core/TreeNode";
import {ImageNode} from "./ImageNode";
import EditorState from "../../contexts/EditorState";

export class ImageCommand extends AbstractCommand<AbstractNode> {
    execute(node: AbstractNode, context: EditorState.Context): void {
        let parent = node.parent;
        let index = parent.parentIndex
        let grandParent = parent.parent;

        let imageNode = new ImageNode

        if (node instanceof TextNode && node.text) {
            grandParent.insertChild(index + 1, imageNode)
        } else {
            parent.remove()
            grandParent.insertChild(index + 1, imageNode)
        }


        context.cursor.currentCursor.container = imageNode
        context.cursor.currentCursor.offset = 0
        context.cursor.triggerCursor()
    }

}