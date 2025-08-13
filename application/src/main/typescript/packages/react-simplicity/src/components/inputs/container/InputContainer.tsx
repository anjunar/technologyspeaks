import "./InputContainer.css"
import React, {createContext, CSSProperties, useCallback, useRef, useState} from "react"
import Select from "../select/Select"
import SchemaSelect from "../../meta/inputs/SchemaSelect";
import {Model} from "../../shared/Model";

function InputContainer(properties: InputContainer.Attributes) {

    const {children, placeholder, className, name, ...rest} = properties

    const [errors, setErrors] = useState([])

    const [empty, setEmpty] = useState(false)

    const [focus, setFocus] = useState(false)

    const [dirty, setDirty] = useState(false)

    const inputContainer = useRef<HTMLDivElement>(null);

    let rawInput: React.ReactElement
    let errorContainers: React.ReactElement[] = []
    let prefixContainer : React.ReactElement
    let suffixContainer : React.ReactElement

    if (children instanceof Array) {
        rawInput = children[0]
        errorContainers = children.filter(child => child?.type === InputContainer.Error)
        prefixContainer = children.find(child => child?.props["slot"] === "prefix")
        suffixContainer = children.find(child => child?.props["slot"] === "suffix")
    } else {
        rawInput = children as React.ReactElement
        errorContainers = []
        prefixContainer = null
        suffixContainer = null
    }

    const onModelHandler = useCallback((model: Model) => {
        let selects = [Select, SchemaSelect]
        if (selects.indexOf(rawInput.type as any) > -1) {
            setEmpty(false)
        } else {
            if (model.value instanceof Array) {
                setEmpty(model.value.length === 0)
            } else {
                let types = ["date", "time", "datetime-local", "checkbox", "file"]

                if (types.indexOf(model.type) > -1) {
                    setEmpty(false)
                } else {
                    setEmpty(model.value === "" || model.value === undefined || model.value === null)
                }
            }
        }

        setErrors(Array.from(model.errors))

        setDirty(model.dirty)
    }, [])

    const onFocusHandler = () => {
        let inputElement = inputContainer.current.querySelector("input");
        if (inputElement) {
            if (! inputElement.disabled) {
                setFocus(true)
                if (inputElement) {
                    inputElement.focus()
                }
            }
        } else {
            setFocus(true)
        }
    }

    const onBlurHandler = () => {
        setFocus(false)
    }

    let props = {
        onModel: onModelHandler,
        onFocus: onFocusHandler,
        onBlur: onBlurHandler
    }
    const input = React.cloneElement(rawInput, props)

    return (
        <div className={className ? className + "" : "" + "input-container"} {...rest} onClick={onFocusHandler} onBlur={onBlurHandler}>
            <div className={`${errors.length > 0 ? "error" : ""}${focus ? " focus" : " "}${dirty ? " dirty" : ""}`}>
                <div className={`placeholder`}>
                    <span style={{position : empty ? "absolute" : "relative", fontSize : empty ? "medium" : "xx-small", bottom : empty ? "14px" : 0 }}>
                      {placeholder}
                    </span>
                </div>
                <div ref={inputContainer} style={{lineHeight : "23px", verticalAlign : "bottom"}}>
                    {empty ? "" : prefixContainer}
                    {input}
                    {empty ? "" : suffixContainer}
                </div>
                <hr className={`underline${errors.length > 0 ? " error" : ""}${focus ? " focus" : ""}${dirty ? " dirty" : ""}`}/>
                <div className={`errors${errors.length > 0 ? " error" : ""}${focus ? " focus" : ""}`}>
                    {errors.map((error, index) => (
                        <InputContainer.Provider error={error} key={error.path ? error.path + index : error.type}>
                            {errorContainers.find(
                                errorContainer => error.type === errorContainer.key
                            )}
                        </InputContainer.Provider>
                    ))}
                </div>
            </div>
        </div>
    )
}

const ErrorContext = createContext(null)

namespace InputContainer {
    export interface Attributes {
        children: React.ReactNode
        placeholder: string
        className?: string
        name?: string
        style? : CSSProperties
    }

    export const Error = ErrorContext.Consumer

    export function Provider({error, children}: { error: any, children: React.ReactNode }) {
        return (
            <ErrorContext.Provider value={error}>
                <span>{children}</span>
            </ErrorContext.Provider>
        )
    }
}

export default InputContainer