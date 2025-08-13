import React, {useContext, useEffect, useState} from "react"
import {AbstractActionCommand} from "../../commands/ActionCommand";
import {MarkDownContext} from "../../MarkDownEditor";

function ActionButton(properties: ActionButton.Attributes) {

    const {children, command, title} = properties

    const [disabled, setDisabled] = useState(false)

    const {model, textAreaRef, cursor} = useContext(MarkDownContext)

    function executeCommand() {
        command.execute(textAreaRef.current)
        textAreaRef.current.focus()
    }

    useEffect(() => {

        setDisabled(! command.canExecute(textAreaRef.current))

    }, [textAreaRef.current?.selectionStart]);

    return (
        <button type={"button"}  title={title} disabled={disabled} className={"material-icons"} onClick={executeCommand}>{children}</button>
    )
}

namespace ActionButton {
    export interface Attributes {
        children: React.ReactNode
        command : AbstractActionCommand
        title : string
    }
}

export default ActionButton