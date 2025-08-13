import React, {useContext, useEffect, useState} from "react"
import {TextNode} from "../../core/TreeNode";
import {AbstractCommand} from "../../commands/AbstractCommands";
import {EditorContext} from "../../contexts/EditorState";

function FormatSelect(properties: FormatSelect.Attributes) {

    const {children, callback, command, className, style} = properties

    const [value, setValue] = useState("p")

    const [disabled, setDisabled] = useState(false)

    const context = useContext(EditorContext)


    function onChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const value = event.target.value
        setValue(value)

        command.execute(value, context)
    }

    useEffect(() => {
        if (context.cursor.currentCursor || context.selection.currentSelection) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }

    }, [context.cursor.currentCursor, context.selection.currentSelection]);

    useEffect(() => {
        if (context.cursor.currentCursor) {
            setValue(callback(context.cursor.currentCursor?.container as TextNode))
        }
    }, [context.cursor.currentCursor]);

    return (
        <select disabled={disabled} value={value} onChange={onChange} className={className} style={style}>
            {
                children
            }
        </select>
    )
}

namespace FormatSelect {
    export interface Attributes {
        children: React.ReactNode[]
        callback: (node: TextNode) => string
        command: AbstractCommand<string>
        className?: string
        style?: React.CSSProperties
    }
}

export default FormatSelect