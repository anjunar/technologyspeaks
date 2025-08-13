import "./MarkDownView.css"
import React, {CSSProperties, useEffect, useMemo, useRef} from "react"
import {reMarkFactoryForHTML} from "./parser/ReMarkFactory";
import {useInput} from "../../../hooks";
import EditorModel from "./domain/EditorModel";
import Change from "./domain/Change";

function MarkDownView(properties: MarkDownView.Attributes) {

    const {style, value, standalone, name} = properties

    const viewRef = useRef<HTMLDivElement>(null);

    const [model, state, setState] = useInput<EditorModel>(name, value, standalone, "editor")

    const reMarkForHTML = useMemo(() => {
        return reMarkFactoryForHTML(state)
    }, []);

    function showDiff(element: HTMLElement, changes: Change[]) {

        let deletions = changes.filter(change => change.action === "delete");
        let inserts = changes.filter(change => change.action === "insert" && change.value);
        let updates = changes.filter(change => change.action === "update");
        let moves = changes.filter(change => change.action === "move");

        updates.forEach(aUpdate => {
            const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
            let pos = 0;

            while (walker.nextNode()) {
                const node = walker.currentNode as Text;
                const text = node.textContent || "";
                const len = text.length;

                if (aUpdate.offset >= pos && aUpdate.offset <= (pos + len)) {
                    let parent = node.parentElement;
                    let insertPos = aUpdate.offset - pos;

                    let before = text.slice(0, insertPos);
                    let after = text.slice(insertPos + aUpdate.newValue.length);

                    let beforeNode = document.createTextNode(before);
                    let afterNode = document.createTextNode(after);

                    parent.replaceChild(beforeNode, node);

                    let spanElement = document.createElement("span");
                    spanElement.className = "update";
                    spanElement.textContent = aUpdate.newValue;

                    beforeNode.after(spanElement, afterNode);

                    break;
                }

                pos += len;
            }
        })

        inserts.forEach(aInsert => {
            const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
            let pos = 0;

            while (walker.nextNode()) {
                const node = walker.currentNode as Text;
                const text = node.textContent || "";
                const len = text.length;

                if (aInsert.offset >= pos && aInsert.offset <= (pos + len)) {
                    let parent = node.parentElement;
                    let insertPos = aInsert.offset - pos - 1;

                    let before = text.slice(0, insertPos);
                    let after = text.slice(insertPos + aInsert.value.length);

                    let beforeNode = document.createTextNode(before);
                    let afterNode = document.createTextNode(after);

                    parent.replaceChild(beforeNode, node);

                    let spanElement = document.createElement("span");
                    spanElement.className = "insert";
                    spanElement.textContent = aInsert.value;

                    beforeNode.after(spanElement, afterNode);

                    break;
                }

                pos += len;
            }
        })

        deletions.forEach(aDelete => {

            const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
            let pos = 0;

            while (walker.nextNode()) {
                const node = walker.currentNode as Text;
                const text = node.textContent || "";
                const len = text.length;

                if (aDelete.offset >= pos && aDelete.offset < (pos + len)) {
                    let parent = node.parentElement;

                    let begin = text.slice(0, aDelete.offset - pos);
                    let end = text.slice(aDelete.offset - pos)

                    let textNode = document.createTextNode(begin);
                    parent.replaceChild(textNode, node)

                    let spanElement = document.createElement("span");
                    spanElement.className = "deleted"
                    spanElement.textContent = aDelete.value

                    textNode.after(
                        spanElement,
                        document.createTextNode(end)
                    )
                }

                pos += len
            }

        })

    }

    const html = useMemo(() => {
        const tree = reMarkForHTML.runSync(state.ast);
        return reMarkForHTML.stringify(tree);
    }, [state]);

    useEffect(() => {
        if (state?.ast) {
            if (state.changes) {
                showDiff(viewRef.current, state.changes)
            }
        }
    }, [state]);

    return (
        <div ref={viewRef} className={"mark-down-view"} style={style} dangerouslySetInnerHTML={{__html : html}}></div>
    )
}

namespace MarkDownView {
    export interface Attributes {
        style?: CSSProperties
        name?: string
        standalone?: boolean
        value?: EditorModel
    }
}

export default MarkDownView