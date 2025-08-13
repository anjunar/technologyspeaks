import React, {useContext, useEffect, useState} from "react"
import {MarkDownContext} from "../../MarkDownEditor";
import {AbstractFormatCommand} from "../../commands/FormatCommand";


function FormatButton(properties: FormatButton.Attributes) {

    const {children, command, title} = properties

    const [active, setActive] = useState(false)

    const [disabled, setDisabled] = useState(false)

    const {model, textAreaRef, cursor, updateAST} = useContext(MarkDownContext)

    function onClick() {
        command.execute(active, cursor, textAreaRef.current)

        if (active) {
            updateAST()
        }

        setActive(!active)

        textAreaRef.current.focus()
    }

    useEffect(() => {
        if (cursor !== null) {
            setActive(command.isActive(active, cursor, textAreaRef.current))
            setDisabled(! command.canExecute(cursor, textAreaRef.current))
        }
    }, [cursor])

    return (
        <button title={title} disabled={disabled} className={`material-icons${active ? " active" : ""}`} onClick={onClick}>{children}</button>
    )
}

namespace FormatButton {
    export interface Attributes {
        children: React.ReactNode
        command: AbstractFormatCommand
        title: string
    }
}

export default FormatButton