import React, {useContext, useEffect, useState} from "react"
import {AbstractCommand} from "../../commands/AbstractCommands";
import {AbstractNode} from "../../core/TreeNode";
import {EditorContext} from "../../contexts/EditorState";

function ActionButton(properties: ActionButton.Attributes) {

    const {children, command} = properties

    const context = useContext(EditorContext)

    const [disabled, setDisabled] = useState(false)

    function onClick() {
        command.execute(context.cursor.currentCursor?.container, context)
    }

    useEffect(() => {
        if (context.cursor.currentCursor || context.selection.currentSelection) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }

    }, [context.cursor.currentCursor, context.selection.currentSelection]);

    return (
        <button disabled={disabled} className={"material-icons"} onClick={onClick}>{children}</button>
    )
}

namespace ActionButton {
    export interface Attributes {
        children: React.ReactNode
        command : AbstractCommand<AbstractNode>
    }
}

export default ActionButton