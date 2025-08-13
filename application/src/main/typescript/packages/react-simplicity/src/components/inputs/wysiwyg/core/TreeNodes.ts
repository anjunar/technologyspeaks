import {AbstractContainerNode, AbstractNode} from "./TreeNode";

export function findParent(node: AbstractNode, callback: (node: AbstractNode) => boolean) {

    if (callback(node)) {
        return node
    }

    if (node.parent) {
        return findParent(node.parent, callback)
    }
}

export function findNode(node: AbstractNode | AbstractNode[], callback: (node: AbstractNode) => boolean) {

    if (node instanceof AbstractNode) {
        if (callback(node)) {
            return node
        }
    }

    if (node instanceof AbstractContainerNode) {
        for (const child of node.children) {
            let selectedNode = findNode(child, callback);
            if (selectedNode) {
                return selectedNode
            }
        }
    }

    if (node instanceof Array) {
        for (const child of node) {
            let selectedNode = findNode(child, callback);
            if (selectedNode) {
                return selectedNode
            }
        }
    }
}

export function findNodeWithMaxDepth(
    node: AbstractNode,
    callback: (node: AbstractNode) => boolean,
    maxDepth: number,
    currentDepth: number = 0
): AbstractNode | undefined {
    if (currentDepth > maxDepth) {
        return undefined;
    }

    if (callback(node)) {
        return node;
    }

    if (node instanceof AbstractContainerNode) {
        for (const child of node.children) {
            let selectedNode = findNodeWithMaxDepth(child, callback, maxDepth, currentDepth + 1);
            if (selectedNode) {
                return selectedNode;
            }
        }
    }

    return undefined;
}


export function flatten(node : AbstractNode) : AbstractNode[] {
    if (node instanceof AbstractContainerNode) {
        return [node, ...node.children.flatMap(child => flatten(child))]
    } else {
        return [node]
    }
}