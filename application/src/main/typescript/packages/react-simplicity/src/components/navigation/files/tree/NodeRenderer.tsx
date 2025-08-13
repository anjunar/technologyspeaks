import "./NodeRenderer.css"
import React, {useEffect, useState} from 'react';
import FileManager from "./../FileManager";
import TreeRenderer from "./TreeRenderer";

export function NodeRenderer(properties: NodeRenderer.Attributes) {

    const {node, commands, onContextMenu} = properties

    const [state, setState] = useState(node)

    function onClick(event : React.MouseEvent, tree : FileManager.TreeNode) {
        event.stopPropagation()
        commands.onRead(tree)
    }

    useEffect(() => {
        node.isOpen = state.isOpen
    }, [state]);

    useEffect(() => {
        setState(node)
    }, [node]);

    return (
        <div className={"node-renderer"} onContextMenu={event => onContextMenu(event, state)} onClick={(event) => onClick(event, state)}>
            {
                state.isFolder ? (
                    <button onClick={() => setState({...state, isOpen : ! state.isOpen})} style={{display : "flex", alignItems : "center", gap : "5px"}}>
                        <span className={"material-icons"} style={{fontSize : "16px"}}>{state.isOpen ? "arrow_drop_down" : "arrow_right"}</span>
                        <span className={"material-icons"} style={{fontSize : "16px"}}>folder</span>
                        <span style={{margin : "4px 0"}}>{state.name}</span>
                    </button>
                ) : (
                    <button style={{display : "flex", alignItems : "center", gap : "5px"}}>
                        <span className={"material-icons"} style={{fontSize : "16px"}}>draft</span>
                        <span style={{margin : "4px 0"}}>{state.name}</span>
                    </button>
                )
            }

            {state.children && state.isOpen && (<TreeRenderer nodes={state.children} commands={commands} onContextMenu={onContextMenu}/> )}
        </div>
    )
};

export namespace NodeRenderer {
    export interface Attributes {
        node : FileManager.TreeNode
        commands : FileManager.Commands
        onContextMenu(event : React.MouseEvent, node : FileManager.TreeNode) : void
    }
}

export default NodeRenderer;