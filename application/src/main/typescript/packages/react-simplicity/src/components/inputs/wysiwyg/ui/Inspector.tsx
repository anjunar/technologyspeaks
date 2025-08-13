import "./Inspector.css"
import React, {useContext, useEffect, useState} from "react"
import {AbstractNode} from "../core/TreeNode";
import {EditorContext} from "../contexts/EditorState";
import {DomContext} from "../contexts/DomState";

function Inspector(properties: Inspector.Attributes) {

    const {inspectorRef} = useContext(DomContext)

    const [selectedNodeId, setSelectedNodeId] = useState<string>("")

    const [hierarchicalNodes, setHierarchicalNodes] = useState<AbstractNode[]>([])

    const {providers, cursor: {currentCursor}} = useContext(EditorContext)

    useEffect(() => {

        const nodes: AbstractNode[] = []

        if (currentCursor) {
            let cursor = currentCursor.container

            while (cursor) {
                let provider = providers.find(provider => cursor instanceof provider.node)

                if (provider) {
                    nodes.push(cursor)
                }

                cursor = cursor.parent
            }

            setHierarchicalNodes(nodes)

        }
    }, [currentCursor]);

    useEffect(() => {
        if (hierarchicalNodes.length > 0) {
            setSelectedNodeId(hierarchicalNodes.length === 1 ? hierarchicalNodes[0].id : hierarchicalNodes[1].id)
        }
    }, [hierarchicalNodes]);

    function createTool() {
        if (currentCursor) {
            let selectedNode = hierarchicalNodes.find(node => node.id === selectedNodeId)
            if (selectedNode) {
                let provider = providers.find(provider => selectedNode instanceof provider.node)
                return React.createElement(provider.tool, {node: selectedNode})
            }
            return <div>Select an Element</div>
        } else {
            return <div>Select an Element</div>
        }
    }

    return (
        <div className={"inspector"} ref={inspectorRef} onClick={event => event.stopPropagation()}>
            <div style={{display: "flex", flexDirection: "column"}}>
                <select style={{padding: "4px"}} value={selectedNodeId} onChange={event => setSelectedNodeId(event.target.value)}>
                    {
                        hierarchicalNodes.map(node => (
                                <option key={node.id} value={node.id}>
                                    {providers.find(provider => node instanceof provider.node).title}
                                </option>
                            )
                        )
                    }
                </select>
                <hr style={{width: "100%"}}/>
                {
                    createTool()
                }
            </div>
        </div>
    )
}

namespace Inspector {
    export interface Attributes {}
}

export default Inspector