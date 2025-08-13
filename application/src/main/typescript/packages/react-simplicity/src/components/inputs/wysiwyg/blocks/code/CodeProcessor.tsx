import "./CodeProcessor.css"
import React, {useContext, useEffect, useMemo, useRef, useState} from "react"
import {CodeNode} from "./CodeNode";
import {EditorContext} from "../../contexts/EditorState";
import Prism from "prismjs"
import "prismjs/components/prism-typescript.js";
import TokenLineProcessor from "./TokenLineProcessor";
import {groupTokensIntoLines, tokenDiff, toTokenNodes} from "./CodeUtils";
import {useWheel} from "../../../../../hooks/UseWheelHook";

function CodeProcessor(properties: CodeProcessor.Attributes) {

    const {node} = properties;
    const {ast: {root, triggerAST}, cursor, event: {currentEvent}} = useContext(EditorContext);

    const [renderPass, setRenderPass] = useState(0);
    const preRef = useRef<HTMLPreElement>(null);

    let [scrollTop, setScrollTop] = useWheel(() => {
        return {
            stopPropagating: true,
            ref: preRef,
            maximum: node.virtualHeight - preRef.current.clientHeight
        };
    }, [preRef.current, node.children.length, node.virtualHeight]);

    const offset = useMemo(() => {
        let height = 0;
        for (const child of node.children) {
            if (height + child.domHeight > scrollTop) break;
            height += child.domHeight;
        }
        return height;
    }, [node.children.length, scrollTop]);

    const visibleBlocks = useMemo(() => {
        let height = 0;
        return node.children.filter(child => {
            const isVisible = (height - scrollTop) <= preRef.current?.clientHeight &&
                (height + child.domHeight) >= scrollTop;
            height += child.domHeight;
            return isVisible;
        });
    }, [node.text, scrollTop, renderPass, node.children.map(node => node.id).join(", ")]);

    useEffect(() => {
        let tokens = Prism.tokenize(node.text, Prism.languages.typescript);
        let nodes = toTokenNodes(tokens);
        let tokenLineNodes = groupTokensIntoLines(nodes);
        let tokenDiffer = tokenDiff(node.children, tokenLineNodes);

        node.children.length = 0;
        node.children.push(...tokenDiffer);

        triggerAST();

        setTimeout(() => setRenderPass(1), 0);
    }, []);

    useEffect(() => {
        node.dom = preRef.current;
    }, [node]);


    return (
        <pre ref={preRef} style={{overflow: "auto", maxHeight: "412px"}} className="language-typescript">
            <code style={{display: "block", fontFamily: "monospace", width: "max-content"}} className="language-typescript">
                <div style={{height: offset}}></div>
                {
                    visibleBlocks.map(node => <TokenLineProcessor key={node.id} node={node}/>)
                }
                <div style={{height: Math.max(0, node.virtualHeight - (preRef.current?.clientHeight || 0) - offset)}}></div>
            </code>
        </pre>
    );
}

namespace CodeProcessor {
    export interface Attributes {
        node: CodeNode;
    }
}

export default CodeProcessor;
