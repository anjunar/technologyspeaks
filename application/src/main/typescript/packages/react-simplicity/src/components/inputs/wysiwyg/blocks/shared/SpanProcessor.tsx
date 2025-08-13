import React, {useContext, useEffect, useRef} from "react"
import {AbstractNode, TextNode} from "../../core/TreeNode";
import {findNearestTextRight, onArrowDown, onArrowLeft, onArrowRight, onArrowUp} from "../../utils/ProcessorUtils";
import {ParagraphNode} from "../paragraph/ParagraphNode";
import {CommandRule} from "../../commands/KeyCommand";
import EditorState, {EditorContext} from "../../contexts/EditorState";
import {generateStyleClassNames, generateStyleObject} from "./ProcessorUtils";

function getClientXYFromTextOffset(node: Node, offset: number): { x: number; y: number } | null {
    const range = document.createRange();
    range.setStart(node, offset);
    range.setEnd(node, offset);

    const rects = range.getClientRects();
    const rect = rects[0];

    if (rect) {
        return { x: rect.left, y: rect.top };
    }

    return null;
}

const deleteContentBackward: CommandRule<TextNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode): boolean {
        return (value.type === "Backspace" || value.type === "deleteContentBackward") && node === container
    },
    process(current, node, currentEvent, root) {
        if (current.offset > 0) {
            let start = node.text.substring(0, current.offset - 1);
            let end = node.text.substring(current.offset);
            node.text = start + end;

            if (node.text.length === 0) {
                let prevSibling = node.prevSibling as TextNode;
                if (prevSibling) {
                    node.remove()

                    current.container = prevSibling;
                    current.offset = prevSibling.text.length;
                } else {
                    current.offset = 0
                }
            } else {
                current.offset--;
            }
        } else if (node.parent && node.parent.parent) {
            let parent = node.parent;
            let index = parent.parentIndex;

            if (index > 0) {
                let sibling = parent.prevSibling as ParagraphNode;

                let lastNode = sibling.children[sibling.children.length - 1]
                if (lastNode instanceof TextNode) {
                    let lastNodeLength = lastNode.text.length;
                    lastNode.text += node.text;

                    parent.children
                        .slice(node.parentIndex + 1)
                        .forEach(node => sibling.appendChild(node))

                    current.container = lastNode;
                    current.offset = lastNodeLength;

                    parent.remove()
                } else {
                    if (node.text === "") {
                        let textRight = findNearestTextRight(root, node.parent) as TextNode;
                        current.container = textRight
                        current.offset = textRight.text.length

                        parent.remove()
                    }
                }

            }
        }
    }
}

const compositionUpdate: CommandRule<TextNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode): boolean {
        return value.type === "compositionUpdate" && node === container
    },
    process(current, node: TextNode, currentEvent,) {

        let subString = node.text.substring(current.offset - currentEvent.data.length, current.offset)

        if (subString === currentEvent.data) {
            let start = node.text.substring(0, current.offset - currentEvent.data.length)
            let end = node.text.substring(current.offset)

            node.text = start + end
            current.offset -= currentEvent.data.length;

            console.log(currentEvent.data)
        } else {
            let start = node.text.substring(0, current.offset)
            let end = node.text.substring(current.offset)

            node.text = start + currentEvent.data + end
            current.offset += currentEvent.data.length;

            console.log(currentEvent.data)
        }


    }
}

const insertText: CommandRule<TextNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode): boolean {
        return (value.type === "insertText" || value.type === "insertCompositionText") && node === container
    },
    process(current, node, currentEvent, root) {
        let start = node.text.substring(0, current.offset)
        let end = node.text.substring(current.offset)

        node.text = start + currentEvent.data + end
        current.offset += currentEvent.data.length;

    }
}

const insertLineBreak: CommandRule<TextNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode): boolean {
        return value.type === "insertLineBreak" && node === container
    },
    process(current, node: TextNode, currentEvent, root) {
        const parent = node.parent;
        const grandParent = parent.parent;

        const index = parent.parentIndex;

        const textBefore = node.text.substring(0, current.offset);
        const textAfter = node.text.substring(current.offset);


        let treeNodes = parent.children.slice(node.parentIndex + 1);
        node.text = textBefore;

        if (textAfter || treeNodes.length === 0) {
            const newTextNode = new TextNode(textAfter);
            newTextNode.bold = node.bold;
            newTextNode.italic = node.italic;
            newTextNode.deleted = node.deleted;
            newTextNode.sub = node.sub;
            newTextNode.sup = node.sup;
            const newDivNode = new ParagraphNode([newTextNode, ...treeNodes]);

            grandParent.insertChild(index + 1, newDivNode);

            current.container = newTextNode;
            current.offset = 0;

        } else {
            const newDivNode = new ParagraphNode(treeNodes);

            grandParent.insertChild(index + 1, newDivNode);

            current.container = treeNodes[0];
            current.offset = 0;
        }


    }
}

const arrowLeft: CommandRule<TextNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode) {
        return value.type === "ArrowLeft" && node === container
    },
    process(current, node, currentEvent, root) {
        if (current.offset === 0) {
            onArrowLeft(root, current);
        } else {
            current.offset--
        }
    }
}

const arrowRight: CommandRule<TextNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode) {
        return value.type === "ArrowRight" && node === container
    },
    process(current, node, currentEvent, root) {
        if (current.offset === node.text.length) {
            onArrowRight(root, current);
        } else {
            current.offset++
        }
    }
}

const arrowUp: CommandRule<TextNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode) {
        return value.type === "ArrowUp" && node === container
    },
    process(current, node, currentEvent, root) {

        let {x,y} = getClientXYFromTextOffset(current.container.dom, current.offset);
        // @ts-ignore
        let {offsetNode, offset} = document.caretPositionFromPoint(x, y - 8);

        if (offsetNode === current.container.dom && offset !== current.offset) {
            current.offset = offset
        } else {
            onArrowUp(node, current, root)
        }
    }
}

const arrowDown: CommandRule<TextNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode) {
        return value.type === "ArrowDown" && node === container
    },
    process(current, node, currentEvent, root) {
        let {x,y} = getClientXYFromTextOffset(current.container.dom, current.offset);
        // @ts-ignore
        let {offsetNode, offset} = document.caretPositionFromPoint(x, y + 24);

        if (offsetNode === current.container.dom && offset !== current.offset) {
            current.offset = offset
        } else {
            onArrowDown(node, current, root)
        }
    }
}

const deleteKey: CommandRule<TextNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode) {
        return value.type === "Delete" && node === container
    },
    process(current, node, currentEvent, root) {
        if (current.offset < node.text.length) {
            let start = node.text.substring(0, current.offset);
            let end = node.text.substring(current.offset + 1);
            node.text = start + end;

        } else if (node.parent && node.parent.parent) {
            let parent = node.parent;
            let grandParent = parent.parent;
            let index = parent.parentIndex;

            if (index < grandParent.children.length - 1) {
                let sibling = parent.nextSibling as ParagraphNode;
                let firstTextNode = sibling.children[0] as TextNode;

                let nodeLength = node.text.length;
                node.text += firstTextNode.text;

                firstTextNode.remove()

                for (const child of Array.from(sibling.children)) {
                    parent.appendChild(child);
                }

                if (sibling.children.length === 0) {
                    sibling.remove();
                }

                current.container = node;
                current.offset = nodeLength;
            }
        }
    }
}

const endKey: CommandRule<TextNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode) {
        return value.type === "End" && node === container
    },
    process(current, node, currentEvent, root) {
        current.offset = node.text.length
    }
}

const homeKey: CommandRule<TextNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode) {
        return value.type === "Home" && node === container
    },
    process(current, node, currentEvent, root) {
        current.offset = 0
    }
}

const registry: CommandRule<TextNode>[] = [
    deleteContentBackward,
    insertText,
    compositionUpdate,
    insertLineBreak,
    arrowLeft,
    arrowRight,
    arrowUp,
    arrowDown,
    deleteKey,
    homeKey,
    endKey
]

function SpanProcessor(properties: SpanNode.Attributes) {

    const {node} = properties

    const {ast: {root}, cursor: {currentCursor}, event: {currentEvent}} = useContext(EditorContext)

    const spanRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        node.dom = spanRef.current.firstChild
    }, [node.text]);

    useEffect(() => {

        if (currentEvent?.instance) {

            for (const handler of registry) {
                if (handler.test(currentEvent.instance, node, currentCursor.container)) {

                    currentEvent.queue.push({
                        source: node,
                        type: currentEvent.instance.type,
                        handle() {
                            handler.process(currentCursor, node, currentEvent.instance, root)
                        }
                    })

                    break
                }
            }

        }

    }, [currentEvent?.instance]);

    let classNames = generateStyleClassNames(node);
    let style = generateStyleObject(node);

    return (
        <span ref={spanRef}
              style={Object.keys(style).length === 0 ? null : style}
              className={classNames.length === 0 ? null : classNames.join(" ")}>
            {node.text.length === 0 ? "\u200B" : node.text}
        </span>
    )
}

namespace SpanNode {
    export interface Attributes {
        node: TextNode
    }
}

export default SpanProcessor