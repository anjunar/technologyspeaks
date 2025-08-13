import {AbstractContainerNode, TextNode} from "../../core/TreeNode";
import Entity from "../../../../../mapper/annotations/Entity";
import Basic from "../../../../../mapper/annotations/Basic";

@Entity("ParagraphNode")
export class ParagraphNode extends AbstractContainerNode<TextNode> {

    $type = "ParagraphNode"

    @Basic()
    children: TextNode[];

    constructor(children: TextNode[] = []) {
        super(children);
    }

    mergeAdjacentTextNodes() {
        if (this.children.length < 2) return;

        let newChildren: TextNode[] = [];
        let lastNode: TextNode | null = null;

        for (let node of this.children) {
            if (lastNode instanceof TextNode && node instanceof TextNode) {
                if (
                    lastNode.bold === node.bold &&
                    lastNode.italic === node.italic &&
                    lastNode.deleted === node.deleted &&
                    lastNode.sup === node.sup &&
                    lastNode.sub === node.sub &&
                    lastNode.fontFamily === node.fontFamily &&
                    lastNode.fontSize === node.fontSize &&
                    lastNode.color === node.color &&
                    lastNode.backgroundColor === node.backgroundColor
                ) {
                    lastNode.text += node.text;
                    continue;
                }
            }

            newChildren.push(node);
            lastNode = node;
        }

        if (newChildren.length > 0) {
            for (const child of Array.from(this.children)) {
                child.remove()
            }

            for (const newChild of newChildren) {
                this.appendChild(newChild)
            }
        }
    }
}

