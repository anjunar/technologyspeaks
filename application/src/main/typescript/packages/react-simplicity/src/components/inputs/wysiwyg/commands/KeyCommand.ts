import {AbstractNode, RootNode} from "../core/TreeNode";
import EditorState from "../contexts/EditorState";

export interface KeyCommand {
    type : string
    source: AbstractNode
    handle: () => void
}

export interface CommandRule<A extends AbstractNode> {
    test(value: EditorState.GeneralEvent, node: AbstractNode, cursor: AbstractNode): boolean

    process(currentCursor: { container: AbstractNode; offset: number }, node: A, currentEvent: EditorState.GeneralEvent, root: RootNode): void
}