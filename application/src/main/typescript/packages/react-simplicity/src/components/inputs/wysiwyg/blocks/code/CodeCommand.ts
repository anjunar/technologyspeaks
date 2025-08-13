import {AbstractCommand} from "../../commands/AbstractCommands";
import {AbstractNode, TextNode} from "../../core/TreeNode";
import {CodeNode} from "./CodeNode";
import EditorState from "../../contexts/EditorState";
import {TokenNode} from "./TokenNode";
import {TokenLineNode} from "./TokenLineNode";

export class CodeCommand extends AbstractCommand<AbstractNode> {
    execute(node: AbstractNode, context: EditorState.Context): void {
        let parent = node.parent;
        let index = parent.parentIndex
        let grandParent = parent.parent;

        let tokenNode = new TokenNode("", "text", 0);
        let tokenLineNode = new TokenLineNode([tokenNode]);
        let codeNode = new CodeNode("");
        codeNode.appendChild(tokenLineNode)

        if (node instanceof TextNode && node.text) {
            grandParent.insertChild(index + 1, codeNode)
        } else {
            parent.remove()
            grandParent.insertChild(index + 1, codeNode)
        }

        context.cursor.currentCursor.container = tokenNode
        context.cursor.currentCursor.offset = 0
        context.cursor.triggerCursor()
    }

}