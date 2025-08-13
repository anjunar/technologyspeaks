import React, {useContext, useDeferredValue, useEffect} from "react"
import {AbstractContainerNode, AbstractNode, TextNode} from "../core/TreeNode";
import {findNode} from "../core/TreeNodes";
import {ParagraphNode} from "../blocks/paragraph/ParagraphNode";
import {EditorContext} from "../contexts/EditorState";
import {DomContext} from "../contexts/DomState";

function cleanUpAST(node: AbstractNode) {

    if (node instanceof ParagraphNode) {
        node.mergeAdjacentTextNodes()
    }


    if (node instanceof AbstractContainerNode) {
        for (const child of node.children) {
            cleanUpAST(child)
        }
    }

}

function CursorManager(properties: CursorManager.Attributes) {

    const {cursorRef, inputRef, contentEditableRef, inspectorRef} = useContext(DomContext)

    const {ast: {root, triggerAST}, cursor} = useContext(EditorContext)

    let cursorDeferredValue = useDeferredValue(cursor);

    function updateCursorPosition(left: number, top: number, height: number) {
        if (cursorRef.current) {
            cursorRef.current.style.left = `${left}px`;
            cursorRef.current.style.top = `${top}px`;
            cursorRef.current.style.height = `${height}px`;
            cursorRef.current.style.display = "block";
        }
    }

    function positionCursor() {
        if (!cursor.currentCursor) return;

        let range = document.createRange();

        let abstractNode = cursor.currentCursor.container as (TextNode);

        if (abstractNode.dom?.isConnected) {
            let abstractNode1 = abstractNode as TextNode

            if (abstractNode.dom instanceof HTMLElement) {
                range.selectNode(abstractNode.dom);
            } else {
                let offset = cursor.currentCursor.offset > abstractNode1.text.length ? abstractNode1.text.length : cursor.currentCursor.offset;
                range.setStart(abstractNode.dom, offset);
                range.collapse(true);
            }

            let clientRect = range.getBoundingClientRect();
            let contentEditableRect = contentEditableRef.current.getBoundingClientRect();

            let left = clientRect.left - contentEditableRect.left;
            let top = clientRect.top - contentEditableRect.top + contentEditableRef.current.scrollTop;
            let height = clientRect.height;

            updateCursorPosition(left, top, height);

            inputRef.current.style.top = top + 6 + "px"
            inputRef.current?.focus();
        }
    }

    useEffect(() => {
        positionCursor();
    }, [cursor]);

    useEffect(() => {
        function onFocus() {
            cursorRef.current.style.display = "block"
        }

        function onBlur() {
            if (cursorRef.current) {
                cursorRef.current.style.display = "none"
            }
        }

        inputRef.current.addEventListener("focus", onFocus)
        inputRef.current.addEventListener("blur", onBlur)

        return () => {
            inputRef.current?.removeEventListener("focus", onFocus)
            inputRef.current?.removeEventListener("blur", onBlur)
        }
    }, [inputRef.current, cursorRef.current]);

    useEffect(() => {

        function onContentClick(event: MouseEvent) {

            if (event.composedPath().includes(inspectorRef.current)) {
                return;
            }
            let selection = window.getSelection();

            if (selection && !selection.isCollapsed) {
                return
            } else {

                // @ts-ignore
                let caretPosition = document.caretPositionFromPoint(event.clientX, event.clientY);

                let selectedNode: AbstractNode
                if (caretPosition.offsetNode instanceof HTMLElement) {
                    if (caretPosition.offsetNode instanceof HTMLImageElement) {
                        selectedNode = findNode(root, (node) => node.dom === caretPosition.offsetNode.parentNode);
                    }
                } else {
                    selectedNode = findNode(root, (node) => node.dom === caretPosition.offsetNode);
                }

                if (selectedNode) {
                    cursor.currentCursor = {
                        container: selectedNode,
                        offset: caretPosition.offsetNode.textContent.includes("\u200B") ? caretPosition.offset - 1 : caretPosition.offset
                    }
                } else {
                    cursor.currentCursor = null
                }

                cleanUpAST(root)

                cursor.triggerCursor()

                inputRef.current?.focus({preventScroll : true});


            }

        }

        let onScroll = () => {
            positionCursor()
        };

        contentEditableRef.current.addEventListener("scroll", onScroll)
        contentEditableRef.current.addEventListener("click", onContentClick)

        return () => {
            contentEditableRef.current?.removeEventListener("scroll", onScroll)
            contentEditableRef.current?.removeEventListener("click", onContentClick)
        }
    }, [contentEditableRef.current]);


    return (
        <></>
    )
}

namespace CursorManager {
    export interface Attributes {}
}

export default CursorManager