import "./AutoSuggest.css"
import React, {CSSProperties, useRef, useState} from "react";
import Input from "./Input";
import {useInput} from "../../../hooks/UseInputHook";

function AutoSuggest(properties : AutoSuggest.Attributes) {

    const {name, children, dynamicWidth, style, loader, value, standalone, onKeyUp, placeholder, onSelection} = properties

    const [open, setOpen] = useState(false)

    const [model, state, setState] = useInput(name, value, standalone, "text")

    const [window, setWindow] = useState([])

    const inputRef = useRef<HTMLInputElement>(null);

    function onKeyUpHandler(event : React.KeyboardEvent) {
        onKeyUp(event)

        if (state?.indexOf("#") > -1) {

            loader({index : 0, limit : 10, value : state, cursorPos : inputRef.current.selectionStart}, (rows, size) => {
                if (size === 0) {
                    setOpen(false)
                } else {
                    setWindow(rows)
                    setOpen(true)
                }
            })

        } else {
            setOpen(false)
        }
    }

    function onSelectionClick(value : any) {
        setOpen(false)
        let start = onSelection(value, inputRef.current.selectionStart);
        inputRef.current.setSelectionRange(start, null, "forward")
        inputRef.current.focus()
    }

    return (
        <div className={"auto-suggest"} style={style}>
            <input type={"text"}
                   ref={inputRef}
                   style={{width : "100%"}}
                   onKeyUp={onKeyUpHandler}
                   placeholder={placeholder}
                   name={name}
                   autoComplete={"off"}
                   onChange={(value : React.ChangeEvent<HTMLInputElement>) => setState(value.target.value)}
                   onKeyDown={event => event.stopPropagation()}
                   value={state}/>
            {
                open ? (
                    <div className={"overlay"}>
                        {
                            window.map(item => (
                                <div key={item.id} className={"item"} onClick={() => onSelectionClick(item)}>
                                    {children(item)}
                                </div>
                            ))
                        }
                    </div>
                ) : ""
            }
        </div>
    )
}

namespace AutoSuggest {
    export interface Attributes {
        loader(query : Query, callback : Callback) : void
        children : (element : any) => React.ReactElement
        dynamicWidth? : boolean
        name? : string
        standalone? : boolean
        value? : string
        style : CSSProperties
        onKeyUp? : (event : React.KeyboardEvent) => void
        placeholder? : string
        onSelection : (value : any, cursorPos : number) => number
    }

    export interface Query {
        index : number
        limit : number
        value : string
        cursorPos : number
    }

    export interface Callback {
        (rows : any[], size : number) : void
    }

}

export default AutoSuggest