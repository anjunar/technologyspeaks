import React, {useContext, useEffect, useRef} from "react"
import {ItemNode} from "./ListNode";
import ProcessorFactory from "../shared/ProcessorFactory";
import {findParent} from "../../core/TreeNodes";
import {AbstractNode, TextNode} from "../../core/TreeNode";
import {ParagraphNode} from "../paragraph/ParagraphNode";
import {CommandRule} from "../../commands/KeyCommand";
import EditorState, {EditorContext} from "../../contexts/EditorState";
import {findNearestTextRight} from "../../utils/ProcessorUtils";

const deleteContentBackward: CommandRule<ItemNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode): boolean {
        return (value.type === "Backspace" || value.type === "deleteContentBackward") && findParent(container, item => node === item) === node
    },
    process(currentCursor, node, currentEvent, root) {
        if (currentCursor.container instanceof TextNode) {
            if (currentCursor.offset === 0) {

                let parent = node.parent;

                let textNode = findNearestTextRight(root, node);

                currentCursor.container = textNode
                currentCursor.offset = textNode.text.length

                node.remove()

                if (parent.children.length === 0) {
                    parent.remove()
                }


            }
        }
    }
}

const insertLineBreak: CommandRule<ItemNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode): boolean {
        return value.type === "insertLineBreak" && findParent(container, item => node === item) === node
    },
    process(currentCursor, node, currentEvent, root) {
        if (currentCursor.container instanceof TextNode) {
            if (currentCursor.offset === currentCursor.container.text.length) {

                let parent = node.parent;
                let parentIndex = node.parentIndex;

                let textNode = new TextNode();

                let firstChild = (node.children[0] as ParagraphNode).children[0] as TextNode
                if (firstChild.text === "") {
                    let grandParent = parent.parent;
                    let grandParentIndex = parent.parentIndex;
                    node.remove()
                    grandParent.insertChild(grandParentIndex + 1, new ParagraphNode([textNode]));
                } else {
                    parent.insertChild(parentIndex + 1, new ItemNode([new ParagraphNode([textNode])]));
                }

                currentCursor.container = textNode
                currentCursor.offset = 0


            }
        }
    }
}

const registry: CommandRule<ItemNode>[] = [
    deleteContentBackward,
    insertLineBreak
]


function ListItemProcessor(properties: ItemProcessor.Attributes) {

    const {node} = properties

    const {ast: {root, triggerAST}, cursor: {currentCursor}, event: {currentEvent}} = useContext(EditorContext)

    const liRef = useRef(null);

    useEffect(() => {
        node.dom = liRef.current
    }, [node]);

    useEffect(() => {

        if (currentEvent.instance) {

            for (const handler of registry) {
                if (handler.test(currentEvent.instance, node, currentCursor.container)) {

                    if (currentEvent.instance.type === "insertLineBreak" && currentCursor.offset === (currentCursor.container as TextNode).text.length) {
                        let index = currentEvent.queue.findIndex(command => command.source instanceof TextNode);
                        if (index > -1) {
                            currentEvent.queue.splice(index, 1)
                        }
                    }

                    if ((currentEvent.instance.type === "deleteContentBackward" || currentEvent.instance.type === "Backspace") && currentCursor.offset === 0) {
                        let index = currentEvent.queue.findIndex(command => command.source instanceof TextNode);
                        if (index > -1) {
                            currentEvent.queue.splice(index, 1)
                        }
                    }

                    currentEvent.queue.push({
                        type: currentEvent.instance.type,
                        source: node,
                        handle() {
                            handler.process(currentCursor, node, currentEvent.instance, root)
                        }
                    })

                    break
                }
            }

        }

    }, [currentEvent]);


    return (
        <li ref={liRef} style={{position: "relative"}}>
            {node.children.map(child => <ProcessorFactory key={child.id} node={child}/>)}
        </li>
    )
}

namespace ItemProcessor {
    export interface Attributes {
        node: ItemNode
    }
}

export default ListItemProcessor