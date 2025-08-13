import React, {useContext} from "react"
import {AbstractNode, RootNode, TextNode} from "../../core/TreeNode";
import SpanProcessor from "./SpanProcessor";
import RootProcessor from "./RootProcessor";
import {EditorContext} from "../../contexts/EditorState";
import {match} from "../../../../../pattern-match/PatternMatching";

function ProcessorFactory(properties: ProcessorFactory.Attributes) : React.ReactNode {

    const {node} = properties

    const {providers} = useContext(EditorContext)

    return match<AbstractNode, React.ReactNode>(node)
        .withObject(TextNode, (node) => {
            return <SpanProcessor node={node}/>
        })
        .withObject(RootNode, (node) => {
            return <RootProcessor node={node as RootNode}/>
        })
        // @ts-ignore
        .withObject(AbstractNode, (node) => {
            let provider = providers.find(provider => node instanceof provider.node);
            return React.createElement(provider.processor, {node})
        })
        .exhaustive()
}

namespace ProcessorFactory {
    export interface Attributes {
        node: AbstractNode
    }
}

export default ProcessorFactory
