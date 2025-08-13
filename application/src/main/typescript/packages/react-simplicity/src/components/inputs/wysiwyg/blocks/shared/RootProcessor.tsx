import React, {useContext, useEffect, useMemo, useRef} from "react";
import {RootNode} from "../../core/TreeNode";
import ProcessorFactory from "./ProcessorFactory";
import {DomContext} from "../../contexts/DomState";
import {useWheel} from "../../../../../hooks/UseWheelHook";

function RootProcessor({node}: RootNode.Attributes) {

    const divRef = useRef<HTMLDivElement>(null);
    const {contentEditableRef} = useContext(DomContext);

    const [scrollTop, setScrollTop] = useWheel(() => {
        return {
            ref : contentEditableRef,
            maximum : node.virtualHeight - contentEditableRef.current.offsetHeight
        }
    }, [contentEditableRef.current, node.children.length, node.virtualHeight]);

    const offset = useMemo(() => {
        let height = 0;
        for (const child of node.children) {
            if (height + child.domHeight > scrollTop) break;
            height += child.domHeight;
        }
        return height;
    }, [node.children.length, scrollTop]);

    const visibleBlocks = useMemo(() => {
        if (!contentEditableRef.current) return [];

        let height = 0;
        return node.children.filter(child => {
            const isVisible = (height - scrollTop) <= contentEditableRef.current.clientHeight &&
                (height + child.domHeight) >= scrollTop;
            height += child.domHeight;
            return isVisible;
        });
    }, [scrollTop, contentEditableRef.current, node.children.map(node => node.id).join(", ")]);

    useEffect(() => {
        node.dom = divRef.current;
    }, [node]);

    return (
        <div ref={divRef} className="root">
            <div style={{height : offset}}></div>
            {visibleBlocks.map(childNode => (
                <ProcessorFactory key={childNode.id} node={childNode}/>
            ))}
            <div style={{height: Math.max(0, node.virtualHeight - (contentEditableRef.current?.clientHeight || 0) - offset)}}></div>
        </div>
    );
}

namespace RootNode {
    export interface Attributes {
        node: RootNode;
    }
}

export default RootProcessor;
