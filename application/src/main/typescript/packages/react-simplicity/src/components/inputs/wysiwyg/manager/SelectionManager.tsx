import React, {useContext, useEffect} from "react"
import {findNode} from "../core/TreeNodes";
import {EditorContext} from "../contexts/EditorState";

function SelectionManager(properties: SelectionManager.Attributes) {

    const {} = properties

    const {ast, selection} = useContext(EditorContext)

    useEffect(() => {

        let onSelectionChange = () => {

            let nativeSelection = window.getSelection();
            if (nativeSelection && !nativeSelection.isCollapsed) {
                let rangeAt = nativeSelection.getRangeAt(0);

                let start = findNode(ast.root, (node) => node.dom === rangeAt.startContainer)
                let end = findNode(ast.root, (node) => node.dom === rangeAt.endContainer)

                if (!(selection.currentSelection &&
                    selection.currentSelection.startContainer === start &&
                    selection.currentSelection.endContainer === end &&
                    selection.currentSelection.startOffset === rangeAt.startOffset &&
                    selection.currentSelection.endOffset === rangeAt.endOffset)) {

                    selection.currentSelection = {
                        startContainer: start,
                        startOffset: rangeAt.startOffset,
                        endContainer: end,
                        endOffset: rangeAt.endOffset
                    }
                }
            } else {

                selection.currentSelection = null

            }

        }

        document.addEventListener("selectionchange", onSelectionChange)

        return () => {
            document.removeEventListener("selectionchange", onSelectionChange)

        }
    }, [selection.currentSelection]);

    useEffect(() => {
        if (selection.currentSelection) {
            let range = document.createRange();
            range.setStart(selection.currentSelection.startContainer.dom, selection.currentSelection.startOffset);
            range.setEnd(selection.currentSelection.endContainer.dom, selection.currentSelection.endOffset);
            let nativeSelection = window.getSelection();
            nativeSelection.removeAllRanges();
            nativeSelection.addRange(range);
        }
    }, [selection.currentSelection]);

    return (
        <></>
    )
}

namespace SelectionManager {
    export interface Attributes {

    }
}

export default SelectionManager