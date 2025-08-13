import React, {useRef} from "react"

export const DomContext = React.createContext<DomState.Context>(null)

function DomState(properties: DomState.Attributes) {

    const {children} = properties

    const editorRef = useRef<HTMLDivElement>(null)

    const inspectorRef = useRef<HTMLDivElement>(null);

    const inputRef = useRef<HTMLTextAreaElement>(null);

    const cursorRef = useRef<HTMLDivElement>(null)

    const contentEditableRef = useRef<HTMLDivElement>(null);

    return (
        <DomContext value={{editorRef, inspectorRef, inputRef, cursorRef, contentEditableRef}}>
            {children}
        </DomContext>
    )
}

namespace DomState {
    export interface Attributes {
        children : React.ReactNode
    }

    export interface Context {
        editorRef : React.RefObject<HTMLDivElement>

        inspectorRef  : React.RefObject<HTMLDivElement>

        inputRef  : React.RefObject<HTMLTextAreaElement>

        cursorRef  : React.RefObject<HTMLDivElement>

        contentEditableRef :  React.RefObject<HTMLDivElement>

    }
}

export default DomState
