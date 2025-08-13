import React, {useContext, useEffect} from "react"
import {EditorContext} from "../contexts/EditorState";
import {DomContext} from "../contexts/DomState";

let isComposing = false

function InputManager(properties: EditorInput.Attributes) {

    const {ast, event, cursor} = useContext(EditorContext)

    const {inputRef} = useContext(DomContext)

    useEffect(() => {

        for (const command of event.currentEvent.queue) {
            command.handle()
        }

        ast.triggerAST()
        cursor.triggerCursor()

    }, [event.currentEvent.queue]);

    useEffect(() => {
        let textarea = inputRef.current;

        function onInput(e: Event) {
            if (isComposing) return;

            let inputEvent = e as InputEvent

            if (! inputEvent.isComposing) {
                event.currentEvent = {
                    queue: [],
                    instance: {
                        type: inputEvent.inputType,
                        data: inputEvent.data
                    }
                }

                event.triggerEvent()
            }

        }

        function onKeyDown(e: KeyboardEvent) {
            const whiteList = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Delete", "Home", "End", "Backspace"]

            if (whiteList.indexOf(e.key) > -1) {

                event.currentEvent = {
                    queue: [],
                    instance: {
                        type: e.key,
                        data: e.key
                    }
                }

                event.triggerEvent()

            }
        }

        function onCompositionUpdate(compositionEvent: CompositionEvent) {
            if (!isComposing) return

            event.currentEvent = {
                queue: [],
                instance: {
                    type: "compositionUpdate",
                    data: compositionEvent.data
                }
            }

            event.triggerEvent()
        }

        let compositionStartListener = () => isComposing = true;
        let compositionEndListener = () => isComposing = false;

        textarea.addEventListener("keydown", onKeyDown)
        textarea.addEventListener("input", onInput)
        textarea.addEventListener("compositionstart", compositionStartListener)
        textarea.addEventListener("compositionupdate", onCompositionUpdate)
        textarea.addEventListener("compositionend", compositionEndListener)

        return () => {
            textarea.removeEventListener("keydown", onKeyDown)
            textarea.removeEventListener("input", onInput)
            textarea.removeEventListener("compositionstart", compositionStartListener)
            textarea.removeEventListener("compositionupdate", onCompositionUpdate)
            textarea.removeEventListener("compositionend", compositionEndListener)
        }
    }, []);

    return (
        <></>
    )
}

namespace EditorInput {
    export interface Attributes {}
}

export default InputManager