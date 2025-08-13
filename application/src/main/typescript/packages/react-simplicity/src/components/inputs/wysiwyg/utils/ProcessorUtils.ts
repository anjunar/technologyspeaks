import {AbstractContainerNode, AbstractNode, RootNode, TextNode} from "../core/TreeNode";
import {TokenNode} from "../blocks/code/TokenNode";

export function findNearestTextLeft(root: RootNode, parent: AbstractContainerNode<any>) : TextNode  {
    let flattened = root.flatten;
    let indexOf = flattened.indexOf(parent.children[parent.children.length - 1])
    return flattened.find((node, index) => index > indexOf && (node instanceof TextNode)) as TextNode
}

export function findNearestTextRight(root: RootNode, parent: AbstractContainerNode<any>) : TextNode {
    let flattened = root.flatten;
    let indexOf = flattened.indexOf(parent);
    return flattened.findLast((node, index) => index < indexOf && (node instanceof TextNode)) as TextNode
}



export function onArrowLeft(root: RootNode, current: { container: AbstractNode; offset: number }) {
    let flattened = root.flatten
    let indexOf = flattened.indexOf(current.container);
    if (indexOf > 0) {
        let container = flattened.findLast((node, index) => index < indexOf && (node instanceof TextNode || node instanceof TokenNode));
        if (container) {
            current.container = container
            if (current.container instanceof TextNode) {
                current.offset = current.container.text.length
            } else {
                current.offset = 0
            }
        }
    }
}

export function onArrowRight(root: RootNode, current: { container: AbstractNode; offset: number }) {
    let flattened = root.flatten
    let indexOf = flattened.lastIndexOf(current.container);
    if (indexOf < flattened.length - 1) {
        current.container = flattened.find((node, index) => index > indexOf && (node instanceof TextNode || node instanceof TokenNode))
        current.offset = 0
    }
}

export function onArrowUp(node: TextNode, current: { container: AbstractNode; offset: number }, root: RootNode) {
    let parent = node.parent;
    if (parent) {
        let grandParent = parent.parent;
        if (grandParent) {
            const parentIndex = parent.parentIndex;
            if (parentIndex > -1) {
                let abstractNode = findNearestTextRight(root, parent);
                if (abstractNode) {
                    const siblingAbove = abstractNode.parent
                    if (siblingAbove instanceof AbstractContainerNode) {

                        let remainingOffset = parent
                            .children
                            .slice(0, node.parentIndex)
                            .reduce((acc, child) => acc + (child as TextNode).text.length, 0) + current.offset;

                        for (const child of siblingAbove.children) {
                            const textLength = (child as TextNode).text.length;

                            if (remainingOffset <= textLength) {
                                current.container = child;
                                current.offset = remainingOffset;
                                return;
                            }

                            remainingOffset -= textLength;
                        }

                        const lastTextNode = siblingAbove.children[siblingAbove.children.length - 1] as TextNode;
                        if (lastTextNode) {
                            current.container = lastTextNode;
                            current.offset = lastTextNode.text.length;
                        }
                    }
                }
            }
        }
    }
}

export function onArrowDown(node: TextNode, current: { container: AbstractNode; offset: number }, root : RootNode) {
    let parent = node.parent;
    if (parent) {
        let grandParent = parent.parent;
        if (grandParent) {
            const parentIndex = parent.parentIndex;
            if (parentIndex >= 0) {
                let abstractNode = findNearestTextLeft(root, parent);
                if (abstractNode) {
                    const siblingBelow = abstractNode.parent
                    if (siblingBelow instanceof AbstractContainerNode) {

                        let remainingOffset = parent
                            .children
                            .slice(0, node.parentIndex)
                            .reduce((acc, child) => acc + (child as TextNode).text.length, 0) + current.offset;

                        for (const child of siblingBelow.children) {
                            const textLength = (child as TextNode).text.length;

                            if (remainingOffset <= textLength) {
                                current.container = child;
                                current.offset = remainingOffset;
                                return;
                            }

                            remainingOffset -= textLength;
                        }

                        const lastTextNode = siblingBelow.children[siblingBelow.children.length - 1] as TextNode;
                        if (lastTextNode) {
                            current.container = lastTextNode;
                            current.offset = lastTextNode.text.length;
                        }
                    }
                }
            }
        }
    }
}


