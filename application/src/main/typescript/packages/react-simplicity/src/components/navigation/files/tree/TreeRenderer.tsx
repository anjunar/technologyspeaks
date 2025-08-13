import React from 'react';
import FileManager from "./../FileManager";
import NodeRenderer from "./NodeRenderer";

export function TreeRenderer(properties: TreeRenderer.Attributes) {

    const {nodes, commands, onContextMenu} = properties

    return (
        <div className={"tree-renderer"}>
            <ul style={{margin : 0}}>
                {nodes.map(node => (
                    <li key={node.name}>
                        <NodeRenderer node={node} commands={commands} onContextMenu={onContextMenu}/>
                    </li>
                ))}
            </ul>
        </div>
    )
};

export namespace TreeRenderer {
    export interface Attributes {
        nodes : FileManager.TreeNode[]
        commands : FileManager.Commands
        onContextMenu(event : React.MouseEvent, node : FileManager.TreeNode) : void
    }
}

export default TreeRenderer;