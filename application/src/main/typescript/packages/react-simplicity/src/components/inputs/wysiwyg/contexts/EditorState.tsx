import React, {TransitionStartFunction, useState, useTransition} from "react"
import {AbstractProvider} from "../blocks/shared/AbstractProvider";
import {AbstractNode, RootNode, TextNode} from "../core/TreeNode";
import {ParagraphNode} from "../blocks/paragraph/ParagraphNode";
import {KeyCommand} from "../commands/KeyCommand";

export const EditorContext = React.createContext<EditorState.Context>(null)

function EditorState(properties: EditorState.Attributes) {

    const {providers, children} = properties

    const [astState, setAstState] = useState(() => {
        return {
            root: new RootNode([new ParagraphNode([new TextNode()])])
        }
    })

    const [cursorState, setCursorState] = useState<{ currentCursor: { container: AbstractNode, offset: number } }>(() => {
        return {
            currentCursor: null
        }
    })

    const [selectionState, setSelectionState] = useState<{
        currentSelection: {
            startContainer: AbstractNode,
            startOffset: number,
            endContainer: AbstractNode,
            endOffset: number
        }
    }>(() => {
        return {
            currentSelection: null
        }
    })

    const [event, setEvent] = useState<{ currentEvent: { queue: KeyCommand[], instance: EditorState.GeneralEvent } }>({
        currentEvent: {
            queue: [],
            instance: null
        }
    })

    const transition = useTransition();

    let value = {
        ast: {
            get root() {
                return astState.root
            },
            set root(value) {
                astState.root = value
            },
            triggerAST() {
                setAstState({...astState})
            }
        },
        providers: providers,
        cursor: {
            get currentCursor() {
                return cursorState.currentCursor
            },
            set currentCursor(value) {
                cursorState.currentCursor = value
            },
            triggerCursor() {
                setCursorState({...cursorState})
            }
        },
        selection: {
            get currentSelection() {
                return selectionState.currentSelection
            },
            set currentSelection(value) {
                selectionState.currentSelection = value
            },
            triggerSelection() {
                setSelectionState({...selectionState})
            }
        },
        event: {
            get currentEvent() {
                return event.currentEvent
            },
            set currentEvent(value) {
                event.currentEvent = value
            },
            triggerEvent() {
                setEvent({...event})
            },
            get transition() {
                return transition
            }
        }
    };

    return (
        <EditorContext value={value}>
            {children}
        </EditorContext>
    )
}

namespace EditorState {
    export interface Attributes {
        children: React.ReactNode
        providers: AbstractProvider<any, any, any, any>[]
    }

    export interface GeneralEvent {
        type: string
        data: string
    }

    export interface Context {
        providers: AbstractProvider<any, any, any, any>[]
        ast: {
            root: RootNode,
            triggerAST(): void
        }
        cursor: {
            currentCursor: {
                container: AbstractNode,
                offset: number
            }
            triggerCursor(): void
        },
        selection: {
            currentSelection: {
                startContainer: AbstractNode,
                startOffset: number,
                endContainer: AbstractNode,
                endOffset: number,
            },
            triggerSelection(): void
        }
        event: {
            currentEvent: {
                queue: KeyCommand[],
                instance: GeneralEvent
            }
            triggerEvent(): void
            transition: [boolean, TransitionStartFunction]
        }
    }
}

export default EditorState